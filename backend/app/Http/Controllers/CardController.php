<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\BoardList;
use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CardController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Board $board, BoardList $list): JsonResponse
    {
        $this->authorize('update', $board);

        if ($list->board_id !== $board->id) {
            return response()->json(['message' => 'List does not belong to this board'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $maxPosition = $list->cards()->max('position') ?? -1;
        $validated['position'] = $maxPosition + 1;

        $card = $list->cards()->create($validated);

        return response()->json($card, 201);
    }

    public function update(Request $request, Board $board, BoardList $list, Card $card): JsonResponse
    {
        $this->authorize('update', $board);

        if ($card->list_id !== $list->id || $list->board_id !== $board->id) {
            return response()->json(['message' => 'Card does not belong to this list or board'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'position' => 'sometimes|required|integer|min:0',
        ]);

        $card->update($validated);

        return response()->json($card);
    }

    public function destroy(Board $board, BoardList $list, Card $card): JsonResponse
    {
        $this->authorize('update', $board);

        // Проверяем, принадлежит ли карточка указанному списку и доске
        if ($card->list_id !== $list->id || $list->board_id !== $board->id) {
            return response()->json(['message' => 'Card does not belong to this list or board'], 403);
        }

        $card->delete();

        return response()->json(null, 204);
    }

    public function reorder(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'source.listId' => 'required|string|exists:lists,id',
            'source.index' => 'required|integer|min:0',
            'destination.listId' => 'required|string|exists:lists,id',
            'destination.index' => 'required|integer|min:0',
        ]);

        // Проверяем, принадлежат ли списки этой доске
        $sourceList = BoardList::findOrFail($validated['source']['listId']);
        $destinationList = BoardList::findOrFail($validated['destination']['listId']);

        if ($sourceList->board_id !== $board->id || $destinationList->board_id !== $board->id) {
            return response()->json(['message' => 'Lists do not belong to this board'], 403);
        }

        // Получаем карточки исходного списка
        $cards = $sourceList->cards()->orderBy('position')->get();
        
        // Получаем перемещаемую карточку
        $movingCard = $cards[$validated['source']['index']];

        if ($validated['source']['listId'] === $validated['destination']['listId']) {
            // Перемещение в пределах одного списка
            $sourceIndex = $validated['source']['index'];
            $destinationIndex = $validated['destination']['index'];

            if ($destinationIndex < $sourceIndex) {
                // Двигаем вверх
                $sourceList->cards()
                    ->where('position', '>=', $destinationIndex)
                    ->where('position', '<', $sourceIndex)
                    ->increment('position');
            } else {
                // Двигаем вниз
                $sourceList->cards()
                    ->where('position', '>', $sourceIndex)
                    ->where('position', '<=', $destinationIndex)
                    ->decrement('position');
            }

            $movingCard->position = $destinationIndex;
            $movingCard->save();
        } else {
            // Перемещение между разными списками
            // Сдвигаем карточки в исходном списке
            $sourceList->cards()
                ->where('position', '>', $validated['source']['index'])
                ->decrement('position');

            // Сдвигаем карточки в целевом списке
            $destinationList->cards()
                ->where('position', '>=', $validated['destination']['index'])
                ->increment('position');

            // Обновляем перемещаемую карточку
            $movingCard->update([
                'list_id' => $validated['destination']['listId'],
                'position' => $validated['destination']['index']
            ]);
        }

        // Возвращаем обновленные списки с карточками
        $updatedLists = $board->lists()
            ->with(['cards' => function($query) {
                $query->orderBy('position');
            }])
            ->orderBy('position')
            ->get();

        return response()->json($updatedLists);
    }
} 