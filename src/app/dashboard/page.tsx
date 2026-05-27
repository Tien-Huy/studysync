import { createClient } from "@/utils/supabase/server";
import AddDocumentForm from "@/components/AddDocumentForm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Kiểm tra trạng thái đăng nhập
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch danh sách tài liệu của user hiện tại
  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy dữ liệu:", error.message);
  }

  return (
    <div className="container mx-auto p-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tài liệu học tập của tôi</h1>
        <form action="/actions/auth/logout" method="post">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Đăng xuất
          </button>
        </form>
      </div>
      <AddDocumentForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents && documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="border p-6 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Loại: {doc.file_type || "Chưa phân loại"}</span>
                <span>
                  {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Bạn chưa có tài liệu nào. Hãy thêm mới!
          </p>
        )}
      </div>
    </div>
  );
}
