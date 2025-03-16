<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BoardController extends Controller
{
    use AuthorizesRequests;

    public function index(): JsonResponse
    {
        $boards = auth()->user()->boards()
            ->with(['lists.cards'])
            ->get();

        return response()->json($boards);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Создаем доску
        $board = auth()->user()->boards()->create($validated);

        // Создаем три списка
        $lists = [
            ['title' => 'Надо сделать', 'position' => 0],
            ['title' => 'В процессе', 'position' => 1],
            ['title' => 'Готово', 'position' => 2],
        ];

        foreach ($lists as $listData) {
            $list = $board->lists()->create($listData);
            
            // Добавляем карточку только в первый список
            if ($listData['position'] === 0) {
                $list->cards()->create([
                    'title' => 'Добро пожаловть на новую доску!',
                    'description' => 'Это твоя первая карточка, попробуй перенести её в другой список!',
                    'position' => 0,
                ]);
            }
        }

        // Загружаем доску со всеми связанными данными
        $board->load(['lists.cards']);

        return response()->json($board, 201);
    }

    public function show(Board $board): JsonResponse
    {
        $this->authorize('view', $board);

        $board->load(['lists.cards']);

        return response()->json($board);
    }

    public function update(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board->update($validated);

        return response()->json($board);
    }

    public function destroy(Board $board): JsonResponse
    {
        $this->authorize('delete', $board);

        $board->delete();

        return response()->json(null, 204);
    }
} 