import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiActivity,
  FiBookOpen,
  FiEdit3,
  FiGrid,
  FiLogOut,
  FiMail,
  FiMoon,
  FiPlusCircle,
  FiShield,
  FiSun,
  FiTrash2,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { authActions } from "../store/auth";
import { useAuth } from "../context/AuthProvider";
import Addbook from "./Addbook";
import Loader from "./Loader/Loader";

function AdminProfile() {
  const [authUser, setAuthUser] = useAuth();
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const adminName =
    profile?.fullname || profile?.name || authUser?.fullname || authUser?.name || "Admin User";
  const adminEmail = profile?.email || authUser?.email || "admin@bookverse.com";
  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const categories = useMemo(
    () => new Set(books.map((book) => book.category).filter(Boolean)).size,
    [books]
  );

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      if (token && id) {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/get-user-information`,
          {
            headers: {
              id,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(userResponse.data);
      } else {
        const storedUser = localStorage.getItem("Users");
        setProfile(storedUser ? JSON.parse(storedUser) : authUser || {});
      }

      const bookResponse = await axios.get(`${import.meta.env.VITE_API_URL}/books/`);
      setBooks(Array.isArray(bookResponse.data) ? bookResponse.data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreatedBook = (book) => {
    if (book) {
      setBooks((current) => [book, ...current]);
    } else {
      fetchDashboard();
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/books/delete-book`, {
        headers: {
          Authorization: `Bearer ${token}`,
          bookid: bookId,
        },
      });

      setBooks((current) => current.filter((book) => book._id !== bookId));
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete book");
    }
  };

  const handleLogout = () => {
    try {
      setAuthUser({
        ...authUser,
        user: null,
      });
      dispatch(authActions.logout());
      dispatch(authActions.changeRole("user"));
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("Users");
      toast.success("Logout successfully");
      navigate("/");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error: " + error);
    }
  };

  const pageClass = darkMode
    ? "min-h-screen bg-slate-950 text-white"
    : "min-h-screen bg-slate-50 text-slate-950";
  const panelClass = darkMode
    ? "border-white/10 bg-white/10 shadow-black/30"
    : "border-white/70 bg-white/80 shadow-slate-200/80";
  const mutedText = darkMode ? "text-slate-300" : "text-slate-600";

  if (loading) {
    return (
      <div className={pageClass}>
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <main className={pageClass}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-white/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-800 p-6 text-white shadow-2xl shadow-indigo-900/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                <FiShield className="h-4 w-4" />
                BookVerse Admin
              </div>
              <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-5xl">
                Command center for your library
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Manage books, publish new resources, and keep your BookVerse collection ready for readers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                {darkMode ? "Light" : "Dark"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
              >
                <FiLogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.55fr]">
          <aside className="space-y-6">
            <div className={`rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl transition ${panelClass}`}>
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-2xl font-black text-white shadow-xl shadow-indigo-500/30">
                  {initials}
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${mutedText}`}>
                    Admin Profile
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-normal">{adminName}</h2>
                  <div className={`mt-2 flex items-center gap-2 text-sm font-semibold ${mutedText}`}>
                    <FiMail className="h-4 w-4" />
                    {adminEmail}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-indigo-600"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-1 ${
                    darkMode
                      ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                  }`}
                >
                  Home
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <div className={`flex items-center gap-3 rounded-2xl p-4 ${darkMode ? "bg-white/10" : "bg-slate-50"}`}>
                  <FiUser className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-bold">Role: {profile?.role || authUser?.role || "admin"}</span>
                </div>
                <div className={`flex items-center gap-3 rounded-2xl p-4 ${darkMode ? "bg-white/10" : "bg-slate-50"}`}>
                  <FiActivity className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-bold">Status: Active session</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard
                darkMode={darkMode}
                icon={FiBookOpen}
                label="Total Books"
                value={books.length}
                color="from-indigo-500 to-blue-500"
              />
              <MetricCard
                darkMode={darkMode}
                icon={FiGrid}
                label="Categories"
                value={categories}
                color="from-cyan-500 to-teal-400"
              />
              <MetricCard
                darkMode={darkMode}
                icon={FiTrendingUp}
                label="Dashboard"
                value="Live"
                color="from-fuchsia-500 to-rose-400"
              />
            </div>
          </aside>

          <section>
            <Addbook embedded onCreated={handleCreatedBook} />
          </section>
        </section>

        <section className={`mt-6 rounded-[2rem] border p-5 shadow-2xl backdrop-blur-xl transition ${panelClass} sm:p-7`}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                <FiGrid className="h-4 w-4" />
                Manage Books
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-normal">Library inventory</h2>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Review recently loaded resources, open details, edit entries, or remove outdated books.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-indigo-600"
            >
              <FiPlusCircle className="h-5 w-5" />
              Add New
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {books.length === 0 ? (
              <div className={`rounded-3xl border border-dashed p-8 text-center md:col-span-2 xl:col-span-3 ${darkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                <FiBookOpen className="mx-auto h-10 w-10 text-indigo-500" />
                <p className="mt-4 text-lg font-black">No books found</p>
                <p className={`mt-2 text-sm ${mutedText}`}>Add your first book using the form above.</p>
              </div>
            ) : (
              books.map((book) => (
                <article
                  key={book._id}
                  className={`group overflow-hidden rounded-3xl border shadow-sm transition hover:-translate-y-1 hover:shadow-2xl ${
                    darkMode
                      ? "border-white/10 bg-white/10 hover:bg-white/20"
                      : "border-slate-200/80 bg-white hover:border-indigo-200"
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={book.image}
                      alt={book.title || book.name}
                      className="h-28 w-20 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-black">{book.title || book.name}</p>
                      <p className={`mt-1 line-clamp-2 text-sm leading-6 ${mutedText}`}>
                        {book.desc || "No description added yet."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700">
                          {book.category || "General"}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          Rs. {book.price || "0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between border-t px-4 py-3 ${darkMode ? "border-white/10" : "border-slate-100"}`}>
                    <Link
                      to={`/view-book-details/${book._id}`}
                      className="text-sm font-black text-indigo-600 transition hover:text-indigo-800"
                    >
                      View
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/update-book/${book._id}`}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
                        title="Edit"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book._id)}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ darkMode, icon: Icon, label, value, color }) {
  return (
    <div
      className={`rounded-[1.75rem] border p-5 shadow-xl backdrop-blur transition hover:-translate-y-1 ${
        darkMode
          ? "border-white/10 bg-white/10 shadow-black/20"
          : "border-white/70 bg-white/80 shadow-slate-200/70"
      }`}
    >
      <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-black tracking-normal">{value}</p>
      <p className={darkMode ? "mt-1 text-sm font-bold text-slate-300" : "mt-1 text-sm font-bold text-slate-500"}>
        {label}
      </p>
    </div>
  );
}

export default AdminProfile;
