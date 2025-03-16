import { useState } from "react";
import { useDeleteCard, useUpdateCard } from "../../hooks/useBoards";
import { createPortal } from "react-dom";

function Card({
  title,
  description,
  due_date: dueDate,
  listId,
  cardId,
  boardId,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: title,
    description: description,
    dueDate: dueDate,
  });

  const deleteCardMutation = useDeleteCard();
  const updateCardMutation = useUpdateCard();

  const handleDeleteCard = async () => {
    try {
      await deleteCardMutation.mutateAsync({
        boardId,
        listId,
        cardId,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateCardMutation.mutateAsync({
        boardId,
        listId,
        cardId,
        data: {
          title: editForm.title,
          description: editForm.description,
          due_date: editForm.dueDate,
        },
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="max-w-2xs cursor-grab rounded bg-white p-2 shadow-sm hover:shadow active:cursor-grabbing">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-xs text-gray-600">{description}</p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              {dueDate && (
                <span className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{formatDate(dueDate)}</span>
                </span>
              )}
              <span>👥</span>
              <span>📎</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleEditClick}
              className="cursor-pointer text-gray-400 transition-colors hover:scale-105 hover:text-blue-500"
            >
              ✏️
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer text-gray-400 transition-colors hover:scale-105 hover:text-red-500"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen &&
        createPortal(
          <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsEditModalOpen(false);
              }
            }}
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold">
                Редактировать карточку
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                    disabled={updateCardMutation.isPending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    disabled={updateCardMutation.isPending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Срок
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={
                      editForm.dueDate
                        ? new Date(editForm.dueDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    disabled={updateCardMutation.isPending}
                  />
                </div>
              </form>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updateCardMutation.isPending}
                  className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={updateCardMutation.isPending}
                  className={`relative rounded px-4 py-2 text-white transition-colors ${
                    updateCardMutation.isPending
                      ? "cursor-not-allowed bg-blue-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  <span
                    className={`inline-flex items-center ${
                      updateCardMutation.isPending ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Сохранить
                  </span>
                  {updateCardMutation.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {isDeleteModalOpen &&
        createPortal(
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
            <div className="rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold">Удалить карточку?</h3>
              <p className="mb-4 text-gray-600">
                Это действие нельзя отменить.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleteCardMutation.isPending}
                  className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteCard}
                  disabled={deleteCardMutation.isPending}
                  className={`relative rounded px-4 py-2 text-white transition-colors ${
                    deleteCardMutation.isPending
                      ? "cursor-not-allowed bg-red-400"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  <span
                    className={`inline-flex items-center ${
                      deleteCardMutation.isPending ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Удалить
                  </span>
                  {deleteCardMutation.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default Card;
