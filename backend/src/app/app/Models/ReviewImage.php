<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewImage extends Model
{
    use HasFactory;

    protected $table = "review_images";
    protected $fillable = [
        'user_review_id',
        'image_name',
        'image_path',
    ];


    public function review(){
        return  $this->belongsTo(UserReview::class);
    }
}
