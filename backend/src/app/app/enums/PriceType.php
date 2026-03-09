<?php

namespace App\Enums;

enum PriceType: string
{
    case TotallyFree = 'totally_free';
    case DrinkOnly = 'drink_only';
    case Paid = 'paid';
}
