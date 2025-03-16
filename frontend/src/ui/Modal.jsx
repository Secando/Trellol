function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Затемнение фона */}
      <div
        className="bg-opacity-50 fixed inset-0 transition-opacity"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          {/* Заголовок */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>

          {/* Контент */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
