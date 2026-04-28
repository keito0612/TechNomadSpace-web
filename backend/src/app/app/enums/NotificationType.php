<?php

namespace App\Enums;

enum NotificationType: string
{
    case Like = 'like';
    case Post = 'post';
    case Notice = 'notice';
}
