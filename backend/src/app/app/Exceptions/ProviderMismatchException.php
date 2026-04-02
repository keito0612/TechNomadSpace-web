<?php

namespace App\Exceptions;

use Exception;

class ProviderMismatchException extends Exception
{
    public function __construct(string $existingProvider)
    {
        parent::__construct("このメールアドレスは {$existingProvider} で登録されています");
    }
}
