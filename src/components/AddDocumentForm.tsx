"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { addDocument } from "@/app/actions/document";

export default function AddDocumentForm() {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const file = formData.get("file") as File;

    let fileUrl = "";
    let fileType = "unknown";

    // Nếu người dùng có chọn file thì tiến hành upload lên Supabase Storage
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // RLS policy của Storage đã ràng buộc thư mục sẽ dựa theo auth.uid()

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("study_materials")
        .upload(filePath, file);

      if (uploadError) {
        alert("Lỗi khi tải file lên: " + uploadError.message);
        setIsUploading(false);
        return;
      }

      // Lấy URL public sau khi upload thành công
      const { data: publicUrlData } = supabase.storage
        .from("study_materials")
        .getPublicUrl(filePath);

      fileUrl = publicUrlData.publicUrl;
      fileType = fileExt || "unknown";
    }

    // Gắn URL và Type vào formData để gửi lên Server Action
    formData.append("fileUrl", fileUrl);
    formData.append("fileType", fileType);

    // Gọi Server Action
    const result = await addDocument(formData);

    setIsUploading(false);
    if (result.success) {
      alert("Thêm tài liệu thành công!");
      formElement.reset(); // Reset form sau khi thêm
    } else {
      alert("Lỗi: " + result.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8 text-black">
      <h2 className="text-xl font-semibold mb-4">Thêm tài liệu mới</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">Tên tài liệu *</label>
          <input
            name="title"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Vd: Slide Bài giảng số 1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Mô tả ngắn</label>
          <textarea
            name="description"
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Ghi chú về tài liệu này..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm mb-1">Đính kèm File (Tùy chọn)</label>
          <input
            type="file"
            name="file"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublic" name="isPublic" value="true" />
          <label htmlFor="isPublic" className="text-sm">
            Công khai cho mọi người cùng xem
          </label>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-fit disabled:bg-gray-400"
        >
          {isUploading ? "Đang xử lý..." : "Đăng tài liệu"}
        </button>
      </form>
    </div>
  );
}
