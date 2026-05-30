/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Database, FolderTree, GitFork, Clipboard, Check, Layers, Sparkles } from 'lucide-react';

interface CodeSnippet {
    id: string;
    name: string;
    path: string;
    lang: string;
    icon: React.ReactNode;
    content: string;
}

export const LaravelCodeVault: React.FC = () => {
    const [activeTab, setActiveTab] = useState('structure'); const [copiedId, setCopiedId] = useState<string | null>(null); const handleCopy = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

    const snippets: CodeSnippet[] = [
        {
            id: 'structure',
            name: 'Folder Structure',
            path: 'Laravel Archetype Guide',
            lang: 'text',
            icon: <FolderTree className="h-4 w-4" />,
            content: `app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── CPNSAnalyticsController.php     <-- REST API Layer
│   └── Requests/
│       └── StoreTryoutResultRequest.php        <-- HTTP Validation Layer
├── Models/
│   ├── User.php
│   └── TryoutResult.php                         <-- Entity & Relationships Map
├── Repositories/
│   ├── Eloquent/
│   │   └── TryoutResultRepository.php           <-- Database Query Layer
│   └── Interfaces/
│       └── TryoutResultRepositoryInterface.php
├── Services/
│   └── CPNSAnalyticsService.php                 <-- High-End Analytics & Ranking Core Business Logic
database/
└── migrations/
    └── 2026_05_20_000000_create_tryout_results_table.php <-- PG Optimized Schema
routes/
└── api.php                                      <-- Routes Definition`
        },
        {
            id: 'migration',
            name: 'PostgreSQL Migration',
            path: 'database/migrations/..._create_tryout_results_table.php',
            lang: 'php',
            icon: <Database className="h-4 w-4" />,
            content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * CPNS database is indexed for ranking optimization.
     */
    public function up(): void
    {
        Schema::create('tryout_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->string('title');
            $table->integer('twk_score');  // Max 150
            $table->integer('tiu_score');  // Max 175
            $table->integer('tkp_score');  // Max 225
            $table->integer('total_score'); // Cached sum (twk + tiu + tkp)
            
            $table->integer('correct_answers')->default(0);
            $table->integer('wrong_answers')->default(0);
            $table->integer('duration_seconds')->default(5400);
            $table->boolean('is_passed')->default(false); // Meets all passing thresholds
            
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            // Optimasi queries untuk Leaderboard & Ranking CPNS (Tie-Breaker sorting)
            $table->index('user_id');
            $table->index([
                'total_score', 
                'tkp_score', 
                'tiu_score', 
                'twk_score'
            ], 'cpns_ranking_tie_breaker_idx');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('tryout_results');
    }
};`
        },
        {
            id: 'models',
            name: 'Eloquent Models',
            path: 'app/Models/TryoutResult.php & User.php',
            lang: 'php',
            icon: <GitFork className="h-4 w-4" />,
            content: `// app/Models/TryoutResult.php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class TryoutResult extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'twk_score',
        'tiu_score',
        'tkp_score',
        'total_score',
        'correct_answers',
        'wrong_answers',
        'duration_seconds',
        'is_passed',
        'submitted_at',
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'submitted_at' => 'datetime',
        'twk_score' => 'integer',
        'tiu_score' => 'integer',
        'tkp_score' => 'integer',
        'total_score' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// -------------------------------------------------------------
// app/Models/User.php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    // ... Sanctum configuration

    public function tryoutResults(): HasMany
    {
        return $this->hasMany(TryoutResult::class);
    }
}`
        },

        {
            id: 'repository',
            name: 'Repository Layer',
            path: 'app/Repositories/Eloquent/TryoutResultRepository.php',
            lang: 'php',
            icon: <Layers className="h-4 w-4" />,
            content: `// app/Repositories/Interfaces/TryoutResultRepositoryInterface.php
namespace App\\Repositories\\Interfaces;


use App\\Models\\TryoutResult;
use Illuminate\\Support\\Collection;

interface TryoutResultRepositoryInterface
{
    public function getByUser(int $userId): Collection;
    public function store(array $data): TryoutResult;
    public function getLeaderboard(bool $onlyPassed = false, ?string $search = null): Collection;
}