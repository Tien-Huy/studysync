"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. LOGIC THÊM TÀI LIỆU
export async function addDocument(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const file = formData.get("file") as File;

  if (!title || !file || file.size === 0) {
    return { error: "Vui lòng điền đầy đủ tên tài liệu và chọn file!" };
  }

  try {
    // Tự động tạo tên file ngẫu nhiên để tránh trùng lặp trên Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file trực tiếp vào Bucket study_materials đã tạo trên Supabase
    const { error: uploadError } = await supabase.storage
      .from("study_materials")
      .upload(filePath, file);

    if (uploadError) {
      return { error: `Lỗi tải file lên Storage: ${uploadError.message}` };
    }

    // Lấy đường dẫn URL công khai của file vừa upload
    const {
      data: { publicUrl },
    } = supabase.storage.from("study_materials").getPublicUrl(filePath);

    // Lưu thông tin tài liệu vào bảng cơ sở dữ liệu documents
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("documents").insert({
      title: title,
      file_url: publicUrl,
      storage_path: filePath, // Giữ lại đường dẫn để sau này xóa file
      user_id: user?.id,
    });

    if (insertError) {
      return {
        error: `Lỗi lưu thông tin vào Database: ${insertError.message}`,
      };
    }

    // Làm mới lại trang Dashboard để cập nhật danh sách ngay lập tức
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: "Đã xảy ra lỗi hệ thống, vui lòng thử lại!" };
  }
}

// 2. LOGIC XÓA TÀI LIỆU
export async function deleteDocument(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const storagePath = formData.get("storagePath") as string;

  if (!id) return;

  try {
    // Bước A: Xóa bản ghi trong bảng documents
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    // Nếu có lỗi thì chỉ in ra console chứ không return object để tránh lỗi TypeScript
    if (dbError) {
      console.error("Lỗi xóa CSDL:", dbError.message);
      return;
    }

    // Bước B: Xóa file vật lý trên Storage dọn rác
    if (storagePath) {
      await supabase.storage.from("study_materials").remove([storagePath]);
    }

    // Làm mới giao diện Dashboard
    revalidatePath("/dashboard");
  } catch (err) {
    console.error(err);
  }
}
