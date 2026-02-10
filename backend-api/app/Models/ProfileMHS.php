<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileMHS extends Model
{
    protected $table = 'profile_mhs';

    protected $fillable = [
        'nama',
        'nim',
        'prodi',
        'fakultas',
        'email',
        'no_hp',
    ];
}
