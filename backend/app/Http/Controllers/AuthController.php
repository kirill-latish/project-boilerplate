<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends BaseController
{
    // New separate Google OAuth methods for sign-in
    public function redirectToGoogleSignIn(): JsonResponse
    {
        $state = base64_encode(json_encode(['action' => 'signin']));

        return $this->sendResponse([
            'url' => Socialite::driver('google')
                ->stateless()
                ->redirectUrl(env('FRONTEND_URL') . '/auth/google/signin/callback')
                ->with(['state' => $state])
                ->redirect()
                ->getTargetUrl(),
        ], trans('Redirecting to Google Sign In'));
    }

    public function handleGoogleSignInCallback(): JsonResponse
    {
        try {
            // Get the authorization code from the request
            $code = request('code');
            $state = request('state');

            \Log::info('Google OAuth callback received', [
                'code' => $code ? 'present' : 'missing',
                'state' => $state,
                'all_params' => request()->all()
            ]);

            if (!$code) {
                return $this->sendError(trans('Authorization code missing'), [], 400);
            }

            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(env('FRONTEND_URL') . '/auth/google/signin/callback')
                ->user();

        } catch (ClientException $e) {
            \Log::error('Google OAuth ClientException', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'response' => $e->getResponse() ? $e->getResponse()->getBody()->getContents() : null
            ]);
            return $this->sendError(trans('Invalid credentials provided'), [], 422);
        } catch (\Exception $e) {
            \Log::error('Google OAuth Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->sendError(trans('OAuth authentication failed: ') . $e->getMessage(), [], 500);
        }

        $user = User::where('email', $socialiteUser->getEmail())->first();

        if (!$user) {
            return $this->sendError(trans('No account found with this email. Please sign up first.'), [], 404);
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        return $this->sendResponse([
            'type' => 'signin',
            'redirect_url' => '/dashboard',
            'user' => $user,
            'access_token' => $user->createToken('google-signin-token')->plainTextToken,
            'token_type' => 'Bearer',
        ], trans('User signed in successfully'));
    }

    // New separate Google OAuth methods for sign-up
    public function redirectToGoogleSignUp(): JsonResponse
    {
        $state = base64_encode(json_encode([
            'action' => 'signup',
           // 'subscription_plan_id' => $subscriptionPlanId,
        ]));

        return $this->sendResponse([
            'url' => Socialite::driver('google')
                ->stateless()
                ->redirectUrl(env('FRONTEND_URL') . '/auth/google/signup/callback')
                ->with(['state' => $state])
                ->redirect()
                ->getTargetUrl(),
        ], trans('Redirecting to Google Sign Up'));
    }

    public function handleGoogleSignUpCallback(): JsonResponse
    {
        try {
            // Get the authorization code from the request
            $code = request('code');
            if (!$code) {
                return $this->sendError(trans('Authorization code missing'), [], 400);
            }

            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl(env('FRONTEND_URL') . '/auth/google/signup/callback')
                ->user();
        } catch (ClientException $e) {
            return $this->sendError(trans('Invalid credentials provided'), [], 422);
        } catch (\Exception $e) {
            return $this->sendError(trans('OAuth authentication failed: ') . $e->getMessage(), [], 500);
        }

        // Decode state to get subscription plan
        $stateRaw = request('state');
        $state = $stateRaw ? json_decode(base64_decode($stateRaw), true) : [];
        $subscriptionPlanId = $state['subscription_plan_id'] ?? null;

        $existingUser = User::where('email', $socialiteUser->getEmail())->first();

        if ($existingUser) {
            // User already exists - handle differently for signup flow
            if ($subscriptionPlanId) {
                $hasSubscription = false;
//                $hasSubscription = $existingUser->subscriptions()
//                    ->where('subscription_plan_id', $subscriptionPlanId)
//                    ->whereIn('state', [Subscription::STATE_ACTIVE, Subscription::STATE_PENDING])
//                    ->exists();

                if (!$hasSubscription) {
                    // Create pending subscription for this plan
//                    $subscription = $existingUser->subscriptions()->create([
//                        'subscription_plan_id' => $subscriptionPlanId,
//                        'state' => Subscription::STATE_PENDING,
//                    ]);
//                    $existingUser->subscription_id = $subscription->id;
//                    $existingUser->saveQuietly();
//
//                    // Encode user_id with URL-safe base64
                    $encodedUserId = rtrim(strtr(base64_encode($existingUser->id), '+/', '-_'), '=');
                    $feUrl = getenv('FRONTEND_URL');
                    $query = http_build_query([
                        'user_id' => $encodedUserId,
                        'first_name' => $existingUser->first_name,
                        'last_name' => $existingUser->last_name,
                    ]);
                    $redirectUrl = rtrim($feUrl, '/') . '/pay?' . $query;

                    return $this->sendResponse([
                        'type' => 'signup',
                        'redirect_url' => $redirectUrl,
                        'user' => $existingUser,
                        'access_token' => $existingUser->createToken('google-signup-token')->plainTextToken,
                        'token_type' => 'Bearer',
                    ], trans('Redirecting to payment for new subscription'));
                }
            }

            // User exists and has subscription or no plan - redirect to dashboard
            return $this->sendResponse([
                'type' => 'signup',
                'redirect_url' => '/dashboard',
                'user' => $existingUser,
                'access_token' => $existingUser->createToken('google-signup-token')->plainTextToken,
                'token_type' => 'Bearer',
            ], trans('User already exists, signed in successfully'));
        }

        // Create new user
        /** @var User $user */
        $user = User::create([
            'email' => $socialiteUser->getEmail(),
            'email_verified_at' => now(),
            'name' => $socialiteUser->getName(),
            'first_name' => explode(" ", $socialiteUser->getName())[0] ?? '',
            'last_name' => explode(" ", $socialiteUser->getName())[1] ?? '',
            'password' => bcrypt(Str::random(32)),
          //  'state' => User::STATE_INACTIVE,
        ]);

//        // If subscription_plan_id is provided, create subscription and redirect to /pay
//        if ($subscriptionPlanId) {
//            $subscription = $user->subscriptions()->create([
//                'subscription_plan_id' => $subscriptionPlanId,
//                'state' => Subscription::STATE_PENDING,
//            ]);
//            $user->subscription_id = $subscription->id;
//            $user->saveQuietly();
//
//
//            // Encode user_id with URL-safe base64
//            $encodedUserId = rtrim(strtr(base64_encode($user->id), '+/', '-_'), '=');
//            $feUrl = getenv('FRONTEND_URL');
//            $query = http_build_query([
//                'user_id' => $encodedUserId,
//                'first_name' => $user->first_name,
//                'last_name' => $user->last_name,
//                'subscription_plan_id' => $subscriptionPlanId,
//            ]);
//            $redirectUrl = rtrim($feUrl, '/') . '/pay?' . $query;
//
//            $response = [
//                'type' => 'signup',
//                'redirect_url' => $redirectUrl,
//                'user' => $user,
//                'access_token' => $user->createToken('google-signup-token')->plainTextToken,
//                'token_type' => 'Bearer',
//            ];
//
//            \Log::info('Signup callback response for new user with subscription', [
//                'redirect_url' => $redirectUrl,
//                'user_id' => $user->id,
//                'subscription_plan_id' => $subscriptionPlanId
//            ]);
//
//            return $this->sendResponse($response, trans('New user registered, redirecting to payment'));
//        }

        // No subscription plan specified - activate user immediately
//        $user->update(['state' => User::STATE_ACTIVE, 'joined_at' => now()]);

        return $this->sendResponse([
            'type' => 'signup',
            'redirect_url' => '/dashboard',
            'user' => $user,
            'access_token' => $user->createToken('google-signup-token')->plainTextToken,
            'token_type' => 'Bearer',
        ], trans('New user registered successfully'));
    }

}
