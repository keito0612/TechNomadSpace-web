<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use DevKandil\NotiFire\Traits\HasFcm;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasFcm;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'image_path',
        'background_image_path',
        'comment',
        'password',
        'provider',
        'provider_id',
        'type',
        'fcm_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public  function likes(){
        return $this->hasMany(Like::class);
    }

    public function reviews(){
        return $this->hasMany(UserReview::class);
    }

    public function setting()
    {
        return $this->hasOne(UserSetting::class);
    }

    public function likedReviews(){
        return $this->belongsToMany(UserReview::class, 'likes', 'user_id', 'user_review_id');
    }

    public function favoriteLocations()
    {
        return $this->belongsToMany(Location::class, 'location_favorites');
    }

    public function routeNotificationForFcm()
    {
        return $this->fcm_token;
    }
}
