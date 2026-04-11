<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Models\LocationFavorite;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocationFavoriteController extends Controller
{
    public function toggle(Request $request, Location $location)
    {
        try{
            $userId = $request->user()->id;

            $exists = LocationFavorite::where('user_id', $userId)
                ->where('location_id', $location->id)
                ->exists();

            if ($exists) {
                LocationFavorite::where('user_id', $userId)
                    ->where('location_id', $location->id)
                    ->delete();
                $isFavorited = false;
            } else {
                LocationFavorite::create([
                    'user_id' => $userId,
                    'location_id' => $location->id,
                ]);
                $isFavorited = true;
            }

            return response()->json([
                'isFavorited' => $isFavorited,
            ], Response::HTTP_OK);

        }catch(Exception $e){
            return response()->json([
                'message' => $e->getMessage()
            ],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $keyword = $request->input('keyword');
        $query = Location::whereHas('favorites', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%$keyword%")
                ->orWhere('address', 'LIKE', "%$keyword%");
            });
        }

        $favoriteLocations = $query->get();
        return LocationResource::collection($favoriteLocations)
        ->response()
        ->setStatusCode(Response::HTTP_OK);
    }
}
