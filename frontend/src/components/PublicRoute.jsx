import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  console.log(location);
  // Показываем загрузку, пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  // Если пользователь аутентифицирован, перенаправляем на главную
  if (user) {
    // Возвращаемся на предыдущую страницу или на главную
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  // Если пользователь не аутентифицирован, показываем публичный контент
  return children;
}

export default PublicRoute;
