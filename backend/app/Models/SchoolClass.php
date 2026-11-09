<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['id', 'name', 'data'])]
class SchoolClass extends Model
{
    protected $table = 'classes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['data' => 'array'];
    }
}
