"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDocument(formData: FormData) {
  const supabase = await createClient();

  // Lấy thông tin user đang đăng nhập
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập để thực hiện chức năng này.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const fileUrl = formData.get("fileUrl") as string;
  const fileType = formData.get("fileType") as string;
  const isPublic = formData.get("isPublic") === "true";

  // Insert vào DB
  const { data, error } = await supabase.from("documents").insert([
    {
      user_id: user.id, // Bắt buộc phải khớp với user.id (do RLS policy)
      title,
      description,
      file_url: fileUrl,
      file_type: fileType,
      is_public: isPublic,
    },
  ]);

  if (error) {
    console.error("Lỗi khi thêm tài liệu:", error.message);
    return { success: false, message: error.message };
  }

  // Cập nhật lại giao diện trang dashboard ngay lập tức
  revalidatePath("/dashboard");
  return { success: true, message: "Thêm tài liệu thành công!" };
}
