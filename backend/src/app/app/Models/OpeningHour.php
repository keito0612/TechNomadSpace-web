<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpeningHour extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "opening_hours";
    protected $fillable = [
        'location_id',
        'day_of_week',
        'open_time',
        'close_time',
        'is_closed'
    ];
}
