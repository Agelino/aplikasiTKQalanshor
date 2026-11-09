<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['resource', 'record_id', 'payload'])]
class DomainRecord extends Model
{
    protected function casts(): array
    {
        return ['payload' => 'array'];
    }
}
