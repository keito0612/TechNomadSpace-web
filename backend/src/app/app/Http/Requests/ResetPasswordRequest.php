<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Override;

class ResetPasswordRequest extends FormRequest
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
            'email'    => 'required|email|exists:users,email',
            'token'    => 'required',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages()
    {
        return [
            'email.required'    => 'メールアドレスは必須です。',
            'email.email'       => '有効なメールアドレスを入力してください。',
            'email.exists'      => 'このメールアドレスは登録されていません。',
            'token.required'    => 'トークンが見つかりません。',
            'password.required' => '新しいパスワードを入力してください。',
            'password.string'   => 'パスワードは文字列で入力してください。',
            'password.min'      => 'パスワードは8文字以上で入力してください。',
            'password.confirmed'=> 'パスワード確認が一致しません。',
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $res = response()->json(
            [
                'errors' => $validator->errors(),
            ],
            400
        );
        throw new HttpResponseException($res);
    }
}
