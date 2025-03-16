function Main({ children }) {
  return (
    <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6">
      <div className="mx-2rem max-w-9xl h-full">{children}</div>
    </main>
  );
}

export default Main;
