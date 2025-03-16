# Trellol

Fullstack приложение (клон Trello) на **React (Vite)** + **Laravel**.

## ✨ Демонстрация

[Демо-версия](https://your-live-demo-link.com) _(если есть)_

## 🔧 Технологии

- **Frontend:** React, Vite, Redux Toolkit, TailwindCSS
- **Backend:** Laravel, Sanctum (для аутентификации)
- **База данных:** SQLite
- **Контейнеризация:** Docker, Docker Compose

## ⚙️ Установка и запуск

### 1. Клонирование репозитория

```sh
git clone https://github.com/your-username/your-trello-clone.git
cd your-trello-clone
```

### 2. Запуск Frontend (React + Vite)

```sh
cd frontend
npm install
npm run dev
```

По умолчанию, фронтенд запустится на `http://localhost:5173/`.

### 3. Запуск Backend (Laravel) без Docker

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate  # Запускаем миграции
php artisan serve
```

Бэкенд будет доступен на `http://127.0.0.1:8000/`.

### 4. Запуск Backend с Docker

Перейдите в папку `backend` и запустите контейнеры:

```sh
cd backend
docker-compose up -d --build
```

Это поднимет Laravel в контейнере, а также Nginx.
Бэкенд будет доступен на `http://localhost/`.

### 5. Настройка переменных окружения

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

### Backend (Docker + Nginx)

Если используется Docker, настройте `docker-compose.yml` в `backend` и запустите:

```sh
docker-compose up -d --build
```

## ✨ Скриншоты

![Главная страница](https://your-image-link.com)
