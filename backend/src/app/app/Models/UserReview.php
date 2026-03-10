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

    protected $appends = ['posted_at_human'];

    public  function user(){
        return $this->belongsTo(User::class);
    }

    public  function location(){
        return $this->belongsTo(Location::class);
    }

    public  function likes(){
        return  $this->hasMany(Like::class);
    }

    public   function images(){
        return $this->hasMany(ReviewImage::class);
    }

    public function getPostedAtHumanAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
