<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LocationController extends Controller
{
    public function locations()
    {
        $locations = Location::with([
            'amenity',
            'openingHours',
            'images',
            'reviews' => function ($query) {
                $query->with([
                    'images',
                    'user',
                ]);
            },
        ])->get();

        return LocationResource::collection($locations)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
