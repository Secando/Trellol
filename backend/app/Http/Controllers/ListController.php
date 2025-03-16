<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ListController extends Controller
{
    use AuthorizesRequests;
    
    public function index(Board $board): JsonResponse
    {
        $lists = $board->lists()
            ->with(['cards' => function($query) {
                $query->orderBy('position'); // сортируем карточки по позиции
            }])
            ->orderBy('position') // сортируем списки по позиции
            ->get();
    
        return response()->json($lists);
    }

    public function store(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // Получаем максимальную позицию в текущей доске
        $maxPosition = $board->lists()->max('position') ?? -1;
        
        // Добавляем position к валидированным данным
        $validated['position'] = $maxPosition + 1;
        
        $list = $board->lists()->create($validated);

        return response()->json($list, 201);
    }

    public function update(Request $request, BoardList $list): JsonResponse
    {
        $this->authorize('update', $list->board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'position' => 'sometimes|required|integer|min:0',
        ]);

        $list->update($validated);

        return response()->json($list);
    }

    public function destroy(Board $board, BoardList $list): JsonResponse
    {
        $this->authorize('update', $board);

        // Проверяем, принадлежит ли список этой доске
        if ($list->board_id !== $board->id) {
            return response()->json(['message' => 'List does not belong to this board'], 403);
        }

        $list->delete();

        return response()->json(null, 204);
    }

    public function reorder(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'lists.sourceIndex' => 'required|integer|min:0',
            'lists.destinationIndex' => 'required|integer|min:0',
        ]);

        $lists = $board->lists()->orderBy('position')->get();
        
        $sourceIndex = $validated['lists']['sourceIndex'];
        $destinationIndex = $validated['lists']['destinationIndex'];

        if ($sourceIndex === $destinationIndex) {
            return response()->json($lists);
        }

        // Получаем перемещаемый список
        $movingList = $lists[$sourceIndex];

        if ($destinationIndex < $sourceIndex) {
            // Двигаем вверх: увеличиваем position для списков между destination и source
            $board->lists()
                ->where('position', '>=', $destinationIndex)
                ->where('position', '<', $sourceIndex)
                ->increment('position');
                
            $movingList->position = $destinationIndex;
        } else {
            // Двигаем вниз: уменьшаем position для списков между source и destination
            $board->lists()
                ->where('position', '>', $sourceIndex)
                ->where('position', '<=', $destinationIndex)
                ->decrement('position');
                
            $movingList->position = $destinationIndex;
        }

        $movingList->save();

        // Возвращаем обновленные списки
        $updatedLists = $board->lists()->orderBy('position')->get();
        return response()->json($updatedLists);
    }
} 