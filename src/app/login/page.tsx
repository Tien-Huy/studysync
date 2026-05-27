import { login, signup } from "@/app/actions/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-black">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center mb-6">
          StudySync Lọc Đăng Nhập
        </h1>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-yellow-100 text-yellow-700 text-center rounded-md mb-4">
            {searchParams.message}
          </p>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="fullName"
            >
              Họ và tên (Chỉ dành cho Đăng ký)
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              name="fullName"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email *
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              name="email"
              type="email"
              placeholder="sinhvien@example.com"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Mật khẩu *
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              formAction={login}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
            <button
              formAction={signup}
              className="w-full bg-gray-100 text-gray-800 border py-2 rounded-md hover:bg-gray-200 transition"
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
