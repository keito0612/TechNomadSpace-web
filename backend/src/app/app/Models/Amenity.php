<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;
    protected $table = "amenities";
    protected $fillable = [
        'location_id',
        'has_wifi',
        'has_power',
        'has_monitor',
        'has_private_booth',
        'has_free_drink',
        'wifi_speed_avg'
    ];

    function location() {
        return $this->belongsTo(Location::class);
    }
}
