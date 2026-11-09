<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id', 'name', 'username', 'nis', 'nisn', 'status', 'class_id', 'rombel_id', 'profile'])]
class Student extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['profile' => 'array'];
    }
}
