import { Link } from "react-router-dom";
import { useState } from "react";
import CreateBoardModal from "../components/board/CreateBoardModal";
import { useBoards, useCreateBoard } from "../hooks/useBoards";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: boards, isLoading, error } = useBoards();
  const createBoardMutation = useCreateBoard();

  const handleCreateBoard = async (title) => {
    try {
      await createBoardMutation.mutateAsync({ title });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Ошибка загрузки досок: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои доски</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards?.map((board) => (
          <Link
            key={board.id}
            to={`/board/${board.id}`}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-600"
          >
            <h2 className="text-lg font-semibold">{board.title}</h2>
            {board.description && (
              <p className="mt-2 text-sm opacity-80">{board.description}</p>
            )}
            <div className="absolute right-2 bottom-2 text-sm opacity-0 transition-opacity group-hover:opacity-100">
              {board.created_at &&
                new Date(board.created_at).toLocaleDateString()}
            </div>
          </Link>
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        >
          <span className="text-gray-600">+ Создать новую доску</span>
        </button>
      </div>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBoard={handleCreateBoard}
        isLoading={createBoardMutation.isPending}
      />
    </div>
  );
}

export default Home;
