<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**  * App\Models\PricingPlan
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $monthly_price
 * @property string $yearly_price
 * @property string $currency
 * @property string $features
 * @property string $cta_label
 * @property string $cta_href
 * @property string $cta_variant
 * @property string $highlighted
 * @property int $sort_order
 * @property string $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan query()
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereCtaHref($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereCtaLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereCtaVariant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereFeatures($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereHighlighted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereMonthlyPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PricingPlan whereYearlyPrice($value)
 * @mixin \Eloquent
 */
class PricingPlan extends BaseModel
{


    protected $fillable = [
        'name',
        'slug',
        'description',
        'monthly_price',
        'yearly_price',
        'currency',
        'features',
        'cta_label',
        'cta_href',
        'cta_variant',
        'highlighted',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
    ];

    public static function getRules($id = null)
    {
        return [
            'name' => 'string|required',
            'slug' => 'string|required',
            'description' => 'string|nullable',
            'monthly_price' => 'string|required',
            'yearly_price' => 'string|required',
            'currency' => 'string|required',
            'features' => 'string|required',
            'cta_label' => 'string|required',
            'cta_href' => 'string|required',
            'cta_variant' => 'string|required',
            'highlighted' => 'string|required',
            'sort_order' => 'string|required',
            'is_active' => 'string|required',
        ];
    }
    //
}
