"use client";

export default function Layout() {
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect user to sign-in page
    router.push("/signin");
  };
  return (
    <>
      <header className="bg-gray-800 ">
        <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome to HiringHero
          </h1>
          <button
            onClick={handleLogout}
            className="text-xl font-bold text-white"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Your content */}
        </div>
      </main>
    </>
  );
}
