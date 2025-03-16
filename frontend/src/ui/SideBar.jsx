import { Link, NavLink } from "react-router-dom";
import { useAllBoards } from "../hooks/useBoards";

function SideBar({ onClose }) {
  const { data: boards = [] } = useAllBoards();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-gray-50 p-4 drop-shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-600">Навигация</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <span className="text-xl">🏠</span>
          <span className="text-base font-medium">Главная</span>
        </Link>
      </nav>

      <div className="mt-6">
        <h3 className="mb-2 px-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
          Быстрый доступ
        </h3>
        <nav className="space-y-1">
          {boards.map((board) => (
            <NavLink
              key={board.id}
              to={`/board/${board.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={onClose}
            >
              <span className="text-base">📋</span>
              <span className="truncate font-medium">{board.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SideBar;
