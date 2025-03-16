import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../../hooks/useBoards";

function BoardHeader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: board, isLoading, error } = useBoard(id);
  const updateBoardMutation = useUpdateBoard();
  const deleteBoardMutation = useDeleteBoard();
  console.log(board);
  // Начать редактирование
  const handleStartEdit = () => {
    setTitle(board.title);
    setIsEditing(true);
  };

  // Сохранить изменения
  const handleSave = async () => {
    if (!title.trim() || title === board.title) {
      setIsEditing(false);
      return;
    }

    try {
      await updateBoardMutation.mutateAsync({
        id,
        title: title.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  // Обработка нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(board?.title || "");
    }
  };

  // Обработчик нажатия кнопки "Поделиться"
  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => {
      setIsShared(false);
    }, 1000);
  };

  // Обработчик удаления доски
  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить эту доску?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteBoardMutation.mutateAsync(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting board:", error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border-b p-4">
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-b p-4 text-red-500">Ошибка загрузки доски</div>
    );
  }

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="rounded border px-2 py-1 text-xl font-semibold focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              className="rounded px-2 py-1 text-xl font-semibold hover:cursor-pointer hover:bg-gray-100"
              onClick={handleStartEdit}
            >
              {board.title}✏️
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`${
              isShared ? "bg-green-700" : "bg-blue-500 hover:bg-blue-600"
            } min-w-[100px] rounded px-3 py-1 text-white transition-colors`}
            onClick={handleShare}
          >
            {isShared ? "Ссылка скопирована" : "Поделиться"}
          </button>
          <button
            className="cursor-pointer rounded bg-red-700 px-3 py-1 text-white transition-colors hover:bg-red-800 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardHeader;
