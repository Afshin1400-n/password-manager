"use client";

import { useState, useEffect } from "react";
import { usePasswordStore } from "../store/passwordStore";
import { Category, Password } from "../types";

type PasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPassword?: Password | null;
};

export default function PasswordModal({isOpen,onClose,editingPassword,}: PasswordModalProps) {

  const addPassword = usePasswordStore((state) => state.addPassword);
  const updatePassword = usePasswordStore((state) => state.updatePassword);

  const [title, setTitle] = useState<string>("");
  const [password, setPassword] = useState<string | number>("");
  const [category, setCategory] = useState<string>("email");
  const [showPassword, setShowPassword] = useState(false);

  // پر کردن فرم هنگام ویرایش
  useEffect(() => {
    if (editingPassword) {
      setTitle(editingPassword.title);
      setPassword(editingPassword.password);
      setCategory(editingPassword.category);
    } else {
      setTitle("");
      setPassword("");
      setCategory("email");
    }
    setShowPassword(false);
  }, [editingPassword, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(editingPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی
    if (!title.trim() || !password.trim()) {
      alert("همه فیلدهای ستاره‌دار رو پر کن");
      return;
    }

    if (isEditMode && editingPassword) {
      // ✅ حالت ویرایش
      updatePassword(editingPassword.id, {
        title: title.trim(),
        password: password.trim(),
        category,
      });
      alert("✅تغییرات انجام شد ");
    } else {
      // ✅ حالت افزودن
      addPassword({
        title: title.trim(),
        password: password.trim(),
        category,
      });
      alert("✅ آیتم جدید اضافه شد");
    }

    // ریست کردن فرم
    setTitle("");
    setPassword("");
    setCategory("email");
    setShowPassword(false);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "✏️ ویرایش رمز" : "🔐 رمز جدید"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: جیمیل"
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* رمز عبور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رمز عبور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* دسته‌بندی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              <option value="email">📧 ایمیل</option>
              <option value="banking">🏦 بانکی</option>
              <option value="social">📱 شبکه اجتماعی</option>
              <option value="work">💼 کار</option>
              <option value="shopping">🛒 خرید</option>
              <option value="other">📦 سایر</option>
            </select>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              {isEditMode ? "ذخیره تغییرات" : "ذخیره"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              انصراف
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}