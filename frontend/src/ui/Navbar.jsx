import { useState, useMemo } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAllBoards } from "../hooks/useBoards";

function Navbar({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { data: boards = [] } = useAllBoards();

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return boards
      .flatMap((board) =>
        board.lists?.flatMap((list) =>
          list.cards
            ?.filter(
              (card) =>
                card.title?.toLowerCase().includes(query) ||
                card.description?.toLowerCase().includes(query),
            )
            .map((card) => ({
              ...card,
              listTitle: list.title,
              boardTitle: board.title,
              boardId: board.id,
            })),
        ),
      )
      .filter(Boolean);
  }, [boards, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleCardClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="text-[1.6rem] font-semibold">Трэллол</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Поиск карточек ..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="w-64 rounded-lg border bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {showResults && (
              <div className="absolute top-full right-0 left-0 mt-2 max-h-96 overflow-auto rounded-lg border bg-white py-2 shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map((card) => (
                    <NavLink
                      key={card.id}
                      to={`/board/${card.boardId}`}
                      className="block px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        handleCardClick(card.boardId);
                      }}
                    >
                      <div className="font-medium">{card.title}</div>
                      {card.description && (
                        <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {card.description}
                        </div>
                      )}
                      <div className="mt-1 flex gap-2 text-xs text-gray-500">
                        <span>Доска: {card.boardTitle}</span>
                        <span>•</span>
                        <span>Список: {card.listTitle}</span>
                      </div>
                    </NavLink>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600">
                    Результаты не найдены
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative cursor-pointer">
            <button
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="text-xl">👤</span>
              {user && (
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              )}
            </button>

            {showProfileMenu && user && (
              <div className="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
                <div className="cursor-default px-4 py-2 text-sm text-gray-700">
                  Вы вошли как <br />
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
