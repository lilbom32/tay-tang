import type { ComponentChildren } from "preact";
import { Link } from "./Link";
import { isOnline } from "../state/store";
import meta from "../content/meta.json";

const NAV = [
  { href: "/", label: "Trang Chủ" },
  { href: "/lich-trinh", label: "Lịch Trình" },
  { href: "/diem-den", label: "Điểm Đến" },
  { href: "/cam-nang", label: "Cẩm Nang HDV" },
  { href: "/dieu-hanh", label: "Bảng Điều Khiển" },
];

export function Shell({ children }: { children: ComponentChildren }) {
  return (
    <>
      <header class="app-nav">
        <Link href="/" class="brand">
          <span class="brand-dot" />
          {meta.name}
        </Link>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} activeClassName="active">
              {item.label}
            </Link>
          ))}
        </nav>
        <span class={`status-pill ${isOnline.value ? "online" : "offline"}`}>
          {isOnline.value ? "● Trực tuyến" : "● Ngoại tuyến"}
        </span>
      </header>
      <main class="app-main">{children}</main>
    </>
  );
}
