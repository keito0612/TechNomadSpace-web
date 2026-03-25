<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OpeningHourResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'locationId' => $this->location_id,
            'dayOfWeek' => $this->day_of_week,
            'openTime' => $this->open_time,
            'closeTime' => $this->close_time,
            'isClosed' => (bool) $this->is_closed,
        ];
    }
}
