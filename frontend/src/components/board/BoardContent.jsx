import { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "../list/List";
import CreateListModal from "../list/CreateListModal";
import CreateCardModal from "../card/CreateCardModal";
import {
  useLists,
  useCreateList,
  useDeleteList,
  useUpdateListOrder,
  useCreateCard,
  useUpdateCardOrder,
} from "../../hooks/useBoards";
import { useQueryClient } from "@tanstack/react-query";

function BoardContent() {
  const { id: boardId } = useParams();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [deleteModalListId, setDeleteModalListId] = useState(null);
  const [createCardListId, setCreateCardListId] = useState(null);

  const { data: lists = [], isLoading } = useLists(boardId);
  const createListMutation = useCreateList();
  const deleteListMutation = useDeleteList();
  const updateListOrderMutation = useUpdateListOrder();
  const createCardMutation = useCreateCard();
  const updateCardOrderMutation = useUpdateCardOrder();
  const queryClient = useQueryClient();

  const handleCreateList = async (title) => {
    try {
      await createListMutation.mutateAsync({
        boardId,
        data: { title },
      });

      setIsListModalOpen(false);
      await queryClient.refetchQueries({ queryKey: ["lists", boardId] });
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteListMutation.mutateAsync({ boardId, listId });
      setDeleteModalListId(null);
      await queryClient.refetchQueries({ queryKey: ["lists", boardId] });
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleCreateCard = async (cardData) => {
    try {
      await createCardMutation.mutateAsync({
        boardId,
        listId: createCardListId,
        data: cardData,
      });
      setIsCardModalOpen(false);
      await queryClient.refetchQueries({ queryKey: ["lists", boardId] });
      setCreateCardListId(null);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    try {
      if (type === "list") {
        updateListOrderMutation.mutate({
          boardId,
          lists: {
            sourceIndex: source.index,
            destinationIndex: destination.index,
          },
        });
      } else {
        updateCardOrderMutation.mutate({
          boardId,
          source: {
            listId: source.droppableId,
            index: source.index,
          },
          destination: {
            listId: destination.droppableId,
            index: destination.index,
          },
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <>
      <div className="flex-1 overflow-x-scroll p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="board"
            type="list"
            direction="horizontal"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex items-start gap-4 ${
                  snapshot.isDraggingOver ? "rounded-lg" : ""
                }`}
              >
                {lists.map((list, index) => (
                  <Draggable
                    key={list.id.toString()}
                    draggableId={list.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? "rotate-3" : ""}`}
                      >
                        <List
                          id={list.id}
                          title={list.title}
                          cards={list.cards}
                          onCardCreate={handleCreateCard}
                          onDeleteList={handleDeleteList}
                          onOpenCreateCardModal={(id) => {
                            setCreateCardListId(id);
                            setIsCardModalOpen(true);
                          }}
                          onOpenDeleteModal={(id) => setDeleteModalListId(id)}
                          boardId={boardId}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <button
                  onClick={() => setIsListModalOpen(true)}
                  className="h-fit w-72 rounded-lg bg-gray-100 p-2 text-left text-gray-600 hover:bg-gray-200"
                >
                  + Добавить список
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <CreateListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onCreateList={handleCreateList}
        isLoading={createListMutation.isPending}
      />

      <CreateCardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setCreateCardListId(null);
        }}
        onCreateCard={handleCreateCard}
        isLoading={createCardMutation.isPending}
      />

      {deleteModalListId && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Удалить список?</h3>
            <p className="mb-4 text-gray-600">
              Все карточки в этом списке будут удалены. Это действие нельзя
              отменить.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalListId(null)}
                disabled={deleteListMutation.isPending}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteList(deleteModalListId)}
                disabled={deleteListMutation.isPending}
                className={`rounded px-4 py-2 text-white transition-colors ${
                  deleteListMutation.isPending
                    ? "cursor-not-allowed bg-red-400"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <span
                  className={`inline-flex items-center ${deleteListMutation.isPending ? "opacity-0" : "opacity-100"}`}
                >
                  Удалить
                </span>
                {deleteListMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BoardContent;
