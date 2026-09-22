"use client";
import PasswordModal from "./component/passwordModal";
import { useState } from "react";
import { usePasswordStore } from "./store/passwordStore";
import DetailShow from "./component/detailShow";
import DetailFilter from "./component/detailFilter";
import { useThemeStore } from "./store/theme";
import { Password } from "./types";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);

  const passwords = usePasswordStore((state) => state.passwords);
  const removePassword = usePasswordStore((state) => state.removePassword);
  const deleteAllPassword = usePasswordStore((state) => state.deleteAllPassword);
  const toggleFavorite = usePasswordStore((state) => state.toggleFavorite);

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [visiblePasswords, setVisiblePasswords] = useState<string[]>([]);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleEdit = (item: Password) => {
    setEditingPassword(item);
    setIsOpen(true);
  };

  const handleAddPassword = () => {
    setEditingPassword(null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingPassword(null);
  };

  const handleAllDelete = () => {
    if (passwords.length === 0) {
      alert("لیست خالیه!");
      return;
    }

    const confirmed = confirm("مطمئنی میخوای همه پسوردها رو حذف کنی؟");
    if (confirmed) {
      deleteAllPassword();
    }
  };

  const toggleVisibility = (id: string) => {
    if (visiblePasswords.includes(id)) {
      setVisiblePasswords(visiblePasswords.filter((i) => i !== id));
    } else {
      setVisiblePasswords([...visiblePasswords, id]);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ کپی شد!");
    } catch (error) {
      alert("❌ کپی نشد، دوباره تلاش کن");
    }
  };

  // ✅ فیلتر + مرتب‌سازی (علاقه‌مندی‌ها بالا)
  const filtered = passwords
    .filter((p) => {
      if (filter === "all") return true;
      if (filter === "favorite") return p.isFavorite === true;
      return p.category === filter;
    })
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.password.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

  const favoritesCount = passwords.filter((p) => p.isFavorite).length;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* هدر */}
        <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <div>
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              🔐 مدیریت رمزها
            </h1>
            <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              رمزهای خودت رو امن نگه دار
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-11 h-11 flex items-center justify-center rounded-xl text-xl transition
                ${theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"}`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={handleAddPassword}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm"
            >
              + رمز جدید
            </button>
          </div>
        </header>

        {/* نوار جستجو */}
        <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس عنوان و رمز ..."
              className={`w-full px-4 py-3 pr-11 rounded-xl border-2 outline-none transition
                ${theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <DetailFilter setFilter={setFilter} title="همه" value="all" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="⭐ علاقه‌مندی‌ها" value="favorite" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="📧 ایمیل" value="email" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="🏦 بانکی" value="banking" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="📱 شبکه اجتماعی" value="social" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="💼 کار" value="work" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="🛒 خرید" value="shopping" currentFilter={filter} />
            <DetailFilter setFilter={setFilter} title="📦 سایر" value="other" currentFilter={filter} />

            {passwords.length > 0 && (
              <button
                onClick={handleAllDelete}
                className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  theme === "dark"
                    ? "bg-red-900/40 text-red-300 hover:bg-red-900/60"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                🗑️ حذف همه
              </button>
            )}
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <DetailShow title="همه" value="all" passwords={passwords} />
          <DetailShow title="⭐ علاقه‌مندی" value="favorite" passwords={passwords} />
          <DetailShow title="ایمیل" value="email" passwords={passwords} />
          <DetailShow title="بانکی" value="banking" passwords={passwords} />
          <DetailShow title="شبکه اجتماعی" value="social" passwords={passwords} />
          <DetailShow title="کار" value="work" passwords={passwords} />
          <DetailShow title="خرید" value="shopping" passwords={passwords} />
          <DetailShow title="سایر" value="other" passwords={passwords} />
        </div>

        {/* لیست رمزها */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border-2 border-dashed
              ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <p className="text-5xl mb-3">🔐</p>
              <p className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {passwords.length === 0
                  ? "هنوز رمزی ذخیره نکردی"
                  : filter === "favorite"
                    ? "هنوز چیزی رو علاقه‌مند نکردی"
                    : "چیزی پیدا نشد"}
              </p>
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                {passwords.length === 0
                  ? "روی «+ رمز جدید» بزن"
                  : filter === "favorite"
                    ? "روی ستاره ☆ کنار هر رمز بزن"
                    : "جستجو یا فیلتر رو تغییر بده"}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-5 transition-all hover:shadow-md
                  ${theme === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-100 shadow-sm"}
                  ${item.isFavorite ? "ring-1 ring-yellow-400/40" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">

                  {/* آیکون + اطلاعات */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm
                      ${item.isFavorite
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
                      {item.isFavorite ? "⭐" : "🔐"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-lg truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-sm font-mono ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          {visiblePasswords.includes(item.id) ? item.password : "••••••••"}
                        </p>
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className={`text-sm transition ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}
                        >
                          {visiblePasswords.includes(item.id) ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* ⭐ دکمه علاقه‌مندی */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-2.5 rounded-lg transition text-lg ${
                        item.isFavorite
                          ? "text-yellow-500 hover:bg-yellow-50"
                          : theme === "dark"
                            ? "text-gray-400 hover:bg-gray-700 hover:text-yellow-400"
                            : "text-gray-500 hover:bg-yellow-50 hover:text-yellow-500"
                      }`}
                      title={item.isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    >
                      {item.isFavorite ? "⭐" : "☆"}
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className={`p-2.5 rounded-lg transition
                        ${theme === "dark"
                          ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.password)}
                      className={`p-2.5 rounded-lg transition
                        ${theme === "dark"
                          ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}
                      title="کپی"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => removePassword(item.id)}
                      className={`p-2.5 rounded-lg transition
                        ${theme === "dark"
                          ? "text-gray-400 hover:bg-red-900/30 hover:text-red-400"
                          : "text-gray-500 hover:bg-red-50 hover:text-red-500"}`}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* دسته‌بندی */}
                <div className="mt-3">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium
                    ${theme === "dark"
                      ? "bg-purple-900/40 text-purple-300"
                      : "bg-purple-100 text-purple-700"}`}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {isOpen && (
          <PasswordModal
            key={editingPassword?.id ?? "new"}
            isOpen={isOpen}
            onClose={handleCloseModal}
            editingPassword={editingPassword}
          />
        )}
      </div>
    </div>
  );
}