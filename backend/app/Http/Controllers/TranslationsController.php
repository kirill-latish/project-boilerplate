<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

class TranslationsController extends BaseController
{
    public function show(string $lang): JsonResponse
    {
        $lang = strtolower($lang);

        if (!preg_match('/^[a-z0-9_-]+$/i', $lang)) {
            return $this->sendError(trans('Invalid language'), [], 400);
        }

        $path = resource_path("lang/{$lang}.json");

        if (!File::exists($path)) {
            return $this->sendError(trans('File not found'), [], 404);
        }

        $contents = File::get($path);
        $translations = json_decode($contents, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->sendError(trans('Invalid translation file'), [], 500);
        }

        return $this->sendResponse($translations ?? [], null);
    }
}
