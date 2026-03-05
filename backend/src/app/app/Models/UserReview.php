<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserReview extends Model
{
    use HasFactory;
    protected $table = 'user_reviews';

    protected $fillable = [
        'user_id',
        'location_id',
        'rating',
        'comment',
    ];

    function user(){
        return $this->belongsTo(User::class);
    }

    function location(){
        return $this->belongsTo(Location::class);
    }

    function likes(){
        return  $this->hasMany(Like::class);
    }

    function images(){
        return $this->hasMany(ReviewImage::class);
    }
}
