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
        'hourly_price',
        'daily_price',
        'minimum_price',
        'website_url',
        'phone_number',
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

    public function favorites()
    {
        return $this->hasMany(LocationFavorite::class);
    }

    public function isFavoritedBy($userId)
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }
}
