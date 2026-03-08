<?php

namespace App\Helpers;

class SearchHelper
{
    public static function normalizePartNumber($value)
    {
        return preg_replace('/[\s\-\_\.]/', '', strtoupper($value));
    }
}