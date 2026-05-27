// src/app/dashboard/page.tsx
import AddDocumentForm from "@/components/AddDocumentForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { deleteDocument } from "@/app/actions/document";
import DeleteButton from "@/components/DeleteButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Kiểm tra quyền truy cập của người dùng
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Lấy toàn bộ danh sách tài liệu từ Supabase đổ ra, xếp file mới nhất lên đầu
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 md:p-10 text-black min-h-screen bg-gray-50">
      {/* Thanh Header điều hướng */}
      <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">StudySync</h1>
          <p className="text-xs text-gray-500">Tài khoản: {user.email}</p>
        </div>
        <form action={logout}>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium">
            Đăng xuất
          </button>
        </form>
      </div>

      {/* Form thêm tài liệu */}
      <AddDocumentForm />

      {/* Khu vực hiển thị danh sách tài liệu */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Tài liệu đã tải lên của tôi
      </h2>

      {!documents || documents.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg border text-gray-400 text-sm">
          Kho lưu trữ đang trống. Hãy tải lên tài liệu đầu tiên của bạn ở form
          trên nhé!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div>
                <h3 className="font-semibold text-base mb-1 text-gray-800 line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Ngày tải:{" "}
                  {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <div className="flex gap-2 border-t pt-3 mt-2">
                {/* Nút xem/tải file */}
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 font-medium transition text-xs flex items-center justify-center"
                >
                  Xem tài liệu
                </a>

                <DeleteButton id={doc.id} storagePath={doc.storage_path} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
