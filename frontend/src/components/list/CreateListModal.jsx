import { useState } from "react";
import Modal from "../../ui/Modal";

function CreateListModal({ isOpen, onClose, onCreateList, isLoading }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreateList(title.trim());
    setTitle("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создание списка">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Название списка
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
            placeholder="Введите название списка"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className={`relative rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
              isLoading
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <span
              className={`inline-flex items-center ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              Создать
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateListModal;
