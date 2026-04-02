<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationFavorite extends Model
{
    protected $table = "location_favorites";

    protected $fillable = [
        'user_id',
        'location_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
