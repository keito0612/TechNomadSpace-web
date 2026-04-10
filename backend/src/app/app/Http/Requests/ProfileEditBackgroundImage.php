<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileEditBackgroundImage extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'backgroundImage' => 'image|mimes:jpeg,png,jpg|max:2048'
        ];
    }

    public function messages()
    {
        return [
            'backgroundImage.image' => '画像ファイルを選択してください。',
            'backgroundImage.mimes' => '画像の形式はjpeg、png、jpgのいずれかにしてください。',
            'backgroundImage.max' => '画像のサイズは2MB以内にしてください。',
        ];
    }
}
