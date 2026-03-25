<?php

namespace App\Models;

use App\Enums\PriceType;
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
        'closed_days',
        'website_url',
        'phone_number'
    ];

    protected $casts = [
        'price_type' => PriceType::class,
    ];

    public function amenity() {
        return $this->hasOne(Amenity::class);
    }

    public function reviews() {
        return $this->hasMany(UserReview::class);
    }

    public function openingHours()
    {
        return $this->hasMany(OpeningHour::class);
    }

    public function images()
    {
        return $this->hasMany(ReviewImage::class);
    }
}
