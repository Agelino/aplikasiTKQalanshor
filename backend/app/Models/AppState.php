<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['state_key', 'state_value'])]
class AppState extends Model
{
    protected $table = 'app_state';
    protected $primaryKey = 'state_key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['state_value' => 'array'];
    }
}
