import { useState } from "react";
import Modal from "../../ui/Modal";

function CreateBoardModal({ isOpen, onClose, onCreateBoard, isLoading }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateBoard(title);
    setTitle(""); // Очищаем поле после создания
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создание доски">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Название доски
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="Введите название доски"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Создание..." : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;
