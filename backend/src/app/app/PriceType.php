<?php

namespace App;

enum PriceType: string
{
    case TotallyFree = 'totally_free';
    case DrinkOnly = 'drink_only';
    case Paid = 'paid';
}
