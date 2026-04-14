<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'is_email',
        'is_notifacation'
    ];
}
