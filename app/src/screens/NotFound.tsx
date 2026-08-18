import { Link } from "../components/Link";

export function NotFound() {
  return (
    <div class="screen">
      <h1>Không tìm thấy trang</h1>
      <Link href="/">← Về Trang Chủ</Link>
    </div>
  );
}
