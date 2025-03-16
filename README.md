# Trellol
# Trello Clone \U0001F4DD

Fullstack приложение (клон Trello) на **React (Vite)** + **Laravel**.

## 🔧 Технологии
- **Frontend:** React, Vite, React Query, React Router, TailwindCSS
- **Backend:** Laravel, Sanctum (для аутентификации)
- **База данных:** SQLite

## ⚙️ Установка и запуск

### 1. Клонирование репозитория
```sh
git clone https://github.com/your-username/your-trello-clone.git](https://github.com/Secando/Trellol.git
cd Trellol
```

### 2. Запуск Frontend (React + Vite)
```sh
cd frontend
npm install
npm run dev
```
По умолчанию, фронтенд запустится на `http://localhost:5173/`.

### 3. Запуск Backend (Laravel)
```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate  # Запускаем миграции с начальными данными
php artisan serve
```
Бэкенд будет доступен на `http://127.0.0.1:8000/`.

### 4. Настройка переменных окружения
Создайте `.env` файлы в **frontend** и **backend**, укажите API-URL в `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

## ✅ Функционал
- ✅ Регистрация и авторизация (JWT через Laravel Sanctum)
- ✅ CRUD-операции с досками, списками, задачами
- ✅ Перетаскивание задач (Drag & Drop)
- ✅ Управление пользователями и доступами

## 🛠 Развёртывание
### Frontend
Для продакшн-сборки:
```sh
npm run build
```
Разместите файлы сборки (`dist/`) на любом хостинге, например Netlify, Firebase или вручную на сервере.

### Backend (Railway/Render)
1. Разверните Laravel на Railway/Render
2. Используйте SQLite в качестве базы данных
3. Добавьте переменные окружения
4. Деплой Laravel с командой `php artisan migrate`

## ✨ Скриншоты
![Главная страница](https://your-image-link.com)

## 👥 Автор
[Ваше Имя](https://your-portfolio-link.com)



