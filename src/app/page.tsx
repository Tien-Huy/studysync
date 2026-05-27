import { redirect } from "next/navigation";

export default function Home() {
  // Tự động chuyển hướng người dùng sang trang quản lý tài liệu
  redirect("/dashboard");
}
