<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Models\LocationFavorite;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LocationFavoriteController extends Controller
{
    private function userId(){
        return optional(Auth::guard('api')->user())->id;
    }

    public function toggle(Location $location)
    {
        try{
            if(!($location->exists())){
                return response()->json(
                    [
                        'message' => 'location not found'
                    ]
                    ,Response::HTTP_NOT_FOUND
                );
            }

            $userId = $this->userId();

            $favorite = LocationFavorite::where('user_id', $userId)
                ->where('location_id', $location->id)
                ->first();

            if ($favorite) {
                $favorite->delete();
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
        $userId = $this->userId();

        $favoriteLocations = Location::whereHas('favorites', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return LocationResource::collection($favoriteLocations)
        ->response()
        ->setStatusCode(Response::HTTP_OK);
    }
}
