import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
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
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header class="app-nav">
        <Link href="/" class="brand">
          <span class="brand-dot" />
          {meta.name}
        </Link>
        <button class="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Mở điều hướng"><span /> <span /></button>
        <nav class={menuOpen ? "nav-open" : ""}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} activeClassName="active" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <span class={`status-pill ${isOnline.value ? "online" : "offline"}`}>
          {isOnline.value ? "● Trực tuyến" : "● Ngoại tuyến"}
        </span>
      </header>
      {menuOpen && <button class="nav-scrim" type="button" aria-label="Đóng điều hướng" onClick={() => setMenuOpen(false)} />}
      <main class="app-main">{children}</main>
    </>
  );
}
