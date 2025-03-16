import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Показываем загрузку, пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, перенаправляем на логин
  if (!user) {
    // Сохраняем текущий URL для редиректа после логина
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь аутентифицирован, показываем защищенный контент
  return children;
}

export default PrivateRoute;
