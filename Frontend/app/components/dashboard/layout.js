"use client";

export default function Layout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
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
            <img
              src="/logout.png"
              alt="Logout"
              style={{
                width: "26px",
                height: "26px",
              }}
            />
          </button>
        </div>
      </header>
    </>
  );
}
