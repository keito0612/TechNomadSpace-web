<?php

namespace App\Models;

use App\PriceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Location extends Model
{
    use HasFactory;

    protected $table ='locations';
    protected $fillable = [
        'name',
        'address',
        'lat',
        'lng',
        'price_type',
        'display_opening_hours',
        'closed_days',
        'website_url',
        'phone_number'
    ];

    protected $casts = [
        'price_type' => PriceType::class,
        'display_opening_hours' => 'array'
    ];

    public function amenity() {
        return $this->hasOne(Amenity::class);
    }

    public function reviews() {
        return $this->hasMany(UserReview::class);
    }
}
