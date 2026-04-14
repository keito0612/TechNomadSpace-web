<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::with([
            'amenity',
            'openingHours',
            'images.review.user',
            'reviews' => function ($query) {
                $query->with([
                    'images',
                    'user',
                    'likes'
                ]);
            },
        ])->get();

        return LocationResource::collection($locations)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function location($id)
    {
        $location = Location::with([
            'amenity',
            'openingHours',
            'images.review.user',
            'reviews' => function ($query) {
                $query->with([
                    'images',
                    'user',
                    'likes'
                ]);
            },
        ])->find($id);

        if($location === null){
            return response()->json([
                'message' => 'Location Not Found'
            ], Response::HTTP_NOT_FOUND);
        }

        return LocationResource::make($location)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
