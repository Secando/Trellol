import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  getLists,
  createList,
  deleteList,
  updateListOrder,
  createCard,
  updateCardOrder,
  deleteCard,
  updateCard,
  getAllBoards,
  deleteBoard,
} from "../api/boards";

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Инвалидируем кэш досок, чтобы получить обновленные данные
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useBoard(id) {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoard(id),
    enabled: !!id, // Запрос будет выполнен только если есть id
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoard,
    onSuccess: (data) => {
      // Обновляем кэш конкретной доски
      queryClient.setQueryData(["board", data.id.toString()], data);

      // Обновляем список досок
      queryClient.setQueriesData(["boards"], (oldData) => {
        // Проверяем структуру данных
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((board) =>
            board.id === data.id ? data : board,
          ),
        };
      });

      // Инвалидируем кэш списка досок для получения свежих данных
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useLists(boardId) {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => getLists(boardId),
    enabled: !!boardId,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onSuccess: async (data, { boardId }) => {
      // Инвалидируем кэш списков и досок
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,
    onSuccess: async (data, { boardId }) => {
      // Инвалидируем кэш списков и досок
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useUpdateListOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateListOrder,
    onMutate: async ({ boardId, lists }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["lists", boardId] }),
        queryClient.cancelQueries({ queryKey: ["boards"] }),
      ]);

      const previousLists = queryClient.getQueryData(["lists", boardId]);

      queryClient.setQueryData(["lists", boardId], (old) => {
        if (!old) return old;

        const newLists = [...old];
        const [movedList] = newLists.splice(lists.sourceIndex, 1);
        newLists.splice(lists.destinationIndex, 0, movedList);

        return newLists;
      });

      return { previousLists };
    },
    onError: (err, { boardId }, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(["lists", boardId], context.previousLists);
      }
    },
    onSettled: (data, error, { boardId }) => {
      // Инвалидируем кэш списков и досок
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: async (data, { boardId }) => {
      // Инвалидируем кэш списков и досок
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useUpdateCardOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCardOrder,
    onMutate: async ({ boardId, source, destination }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["lists", boardId] }),
        queryClient.cancelQueries({ queryKey: ["boards"] }),
      ]);

      const previousLists = queryClient.getQueryData(["lists", boardId]);

      queryClient.setQueryData(["lists", boardId], (oldLists) => {
        if (!oldLists) return oldLists;

        const newLists = [...oldLists];
        const sourceList = newLists.find(
          (list) => list.id.toString() === source.listId,
        );
        const destList = newLists.find(
          (list) => list.id.toString() === destination.listId,
        );

        if (!sourceList || !destList) return oldLists;

        const sourceCards = [...sourceList.cards];
        const destCards =
          source.listId === destination.listId
            ? sourceCards
            : [...destList.cards];

        const [movedCard] = sourceCards.splice(source.index, 1);

        if (source.listId === destination.listId) {
          sourceCards.splice(destination.index, 0, movedCard);
          sourceList.cards = sourceCards;
        } else {
          destCards.splice(destination.index, 0, movedCard);
          sourceList.cards = sourceCards;
          destList.cards = destCards;
        }

        return newLists;
      });

      return { previousLists };
    },
    onError: (err, { boardId }, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(["lists", boardId], context.previousLists);
      }
    },
    onSettled: (data, error, { boardId }) => {
      // Инвалидируем кэш списков и досок
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: async (data, { boardId }) => {
      // Инвалидируем кэш списков и досок
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCard,
    onSuccess: async (data, { boardId }) => {
      // Инвалидируем кэш списков и досок
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lists", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
      ]);
    },
  });
}

export function useAllBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getAllBoards,
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      // Инвалидируем кэш досок
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
