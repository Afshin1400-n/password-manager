"use client";

import { useState, useEffect } from "react";
import { usePasswordStore } from "../store/passwordStore";
import { Category, Password } from "../types";

type PasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPassword?: Password | null;
};

export default function PasswordModal({ isOpen, onClose, editingPassword }: PasswordModalProps) {
  const addPassword = usePasswordStore((state) => state.addPassword);
  const updatePassword = usePasswordStore((state) => state.updatePassword);

  const [title, setTitle] = useState<string>("");
  const [password, setPassword] = useState<string | number>("");
  const [category, setCategory] = useState<string>("email");
  const [showPassword, setShowPassword] = useState(false);

  // Fill form when editing
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

    // Validation
    if (!title.trim() || !password.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditMode && editingPassword) {
      // ✅ Edit mode
      updatePassword(editingPassword.id, {
        title: title.trim(),
        password: password.trim(),
        category,
      });
      alert("✅ Changes saved");
    } else {
      // ✅ Add mode
      addPassword({
        title: title.trim(),
        password: password.trim(),
        category,
      });
      alert("✅ New item added");
    }

    // Reset form
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
            {isEditMode ? "✏️ Edit Password" : "🔐 New Password"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gmail"
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 border-2 border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              <option value="email">📧 Email</option>
              <option value="banking">🏦 Banking</option>
              <option value="social">📱 Social</option>
              <option value="work">💼 Work</option>
              <option value="shopping">🛒 Shopping</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              {isEditMode ? "Save Changes" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}