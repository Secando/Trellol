import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: "Произошла ошибка при регистрации. Попробуйте позже.",
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ["Пароли не совпадают"] });
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              войти в существующий
            </Link>
          </p>
        </div>

        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="sr-only">
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                  errors.name ? "ring-red-300" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="Имя"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                  errors.email ? "ring-red-300" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                  errors.password ? "ring-red-300" : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="Пароль"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="sr-only">
                Подтвердите пароль
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                  errors.password_confirmation
                    ? "ring-red-300"
                    : "ring-gray-300"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6`}
                placeholder="Подтвердите пароль"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
            >
              {registerMutation.isPending
                ? "Регистрация..."
                : "Зарегистрироваться"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
