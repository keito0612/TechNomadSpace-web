<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $table = "likes";
    protected $fillable = [
        'user_id',
        'user_review_id',
    ];


    function users(){
        return $this->belongsToMany(User::class);
    }

    function reviews(){
        return $this->belongsToMany(UserReview::class);
    }
}
