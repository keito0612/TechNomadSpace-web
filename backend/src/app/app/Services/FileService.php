<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class FileService
{
    protected string $disk;

    public function __construct(string $disk = 'public')
    {
        if(app()->isProduction()){
            $this->disk = 'r2';
        }else{
            $this->disk = $disk;
        }
    }

    /**
     * ファイルを保存する
     */
    public function upload(UploadedFile $file, string $path = '', string $fileName): string
    {
        return $this->getStorage()->putFileAs($path, $file, $fileName, 'public');
    }

    /**
     * ファイルのURLを取得する
     */
    public function getUrl(string $filePath): string
    {
        return $this->getStorage()->url($filePath);
    }

    /**
     * ファイルを削除する
     */
    public function delete(string $filePath): bool
    {
        return $this->getStorage()->delete($filePath);
    }

    /**
     * ファイルが存在するか確認する
     */
    public function exists(string $filePath): bool
    {
        return $this->getStorage()->exists($filePath);
    }

    /**
     * ファイルを取得する
     */
    public function get(string $filePath)
    {
        return $this->getStorage()->get($filePath);
    }

    /**
     * 画像をアップロードしてURLを返す
     */
    public function uploadImage(UploadedFile $image, string $directory): string
    {
        $extension = $image->getClientOriginalExtension();
        $fileName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $path = $this->upload($image, $directory, $fileName);
        return $this->getUrl($path);
    }

    /**
     * 古い画像を削除して新しい画像をアップロードする
     */
    public function replaceImage(?string $oldPath, UploadedFile $newImage, string $directory): string
    {
        if ($oldPath && $this->exists($oldPath)) {
            $this->delete($oldPath);
        }
        return $this->uploadImage($newImage, $directory);
    }

    /**
     * Storageインスタンスを取得する
     */
    protected function getStorage()
    {
        return Storage::disk($this->disk);
    }
}
