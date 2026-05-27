"use client";

import { addDocument } from "@/app/actions/document";
import { useState, useRef } from "react";

export default function AddDocumentForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const res = await addDocument(formData);

    setLoading(false);
    if (res?.error) {
      setMessage(`❌ ${res.error}`);
    } else {
      setMessage("✅ Thêm tài liệu học tập thành công!");
      formRef.current?.reset(); // Xóa sạch dữ liệu cũ trong form sau khi thêm xong
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border mb-8 text-black shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Thêm tài liệu học tập mới
      </h2>

      {message && (
        <p className="mb-4 text-sm font-medium text-blue-600">{message}</p>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tên tài liệu hoặc tiêu đề bài học
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500 text-sm"
            placeholder="Ví dụ: Tài liệu Phân tích thiết kế phần mềm..."
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Chọn tệp tin đính kèm
          </label>
          <input
            type="file"
            name="file"
            required
            className="w-full border px-2 py-1.5 rounded-md text-sm cursor-pointer bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition font-medium text-sm disabled:bg-gray-400"
        >
          {loading ? "Đang tải lên..." : "Tải lên hệ thống"}
        </button>
      </form>
    </div>
  );
}
