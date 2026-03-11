<?php

namespace App\Enums;

enum PriceType: int
{
    case TotallyFree = 0;
    case DrinkOnly = 1;
    case Paid = 2;
}
