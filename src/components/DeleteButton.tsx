"use client"; // Dòng này khai báo đây là Client Component, cho phép dùng onClick

import { deleteDocument } from "@/app/actions/document";

export default function DeleteButton({
  id,
  storagePath,
}: {
  id: string;
  storagePath: string;
}) {
  return (
    <form action={deleteDocument}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="storagePath" value={storagePath || ""} />
      <button
        type="submit"
        className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition text-xs font-medium"
        onClick={(e) => {
          if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
            e.preventDefault(); // Hủy lệnh xóa nếu người dùng chọn Cancel
          }
        }}
      >
        Xóa
      </button>
    </form>
  );
}
