<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'location_id' => ['required', 'integer', 'exists:locations,id'],
            'rating' => ['required', 'integer', 'min:0', 'max:5'],
            'comment' => ['required', 'string', 'max:300'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.required' => '場所を選択してください',
            'location_id.exists' => '選択された場所が存在しません',
            'rating.required' => '評価を選択してください',
            'rating.min' => '評価は0から5までの範囲でお願いします。',
            'rating.max' => '評価は0から5までの範囲でお願いします。',
            'comment.required' => 'コメントを入力してください',
            'comment.max' => 'コメントは300文字以内で入力してください',
            'images.max' => '画像は4枚まで投稿できます',
            'images.*.image' => '画像ファイルを選択してください',
            'images.*.mimes' => '画像はjpeg, png, jpg,webp形式で選択してください',
            'images.*.max' => '画像は1枚あたり5MB以内にしてください',
        ];
    }
}
