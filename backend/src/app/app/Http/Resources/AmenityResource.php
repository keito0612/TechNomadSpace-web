<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmenityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationId' => $this->location_id,
            'hasWifi' => (bool) $this->has_wifi,
            'hasPower' => (bool) $this->has_power,
            'hasMonitor' => (bool) $this->has_monitor,
            'hasPrivateBooth' => (bool) $this->has_private_booth,
            'hasFreeDrink' => (bool) $this->has_free_drink,
            'wifiSpeedAvg' => $this->wifi_speed_avg,
        ];
    }
}
