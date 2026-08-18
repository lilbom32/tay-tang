import { Link } from "../components/Link";
import meta from "../content/meta.json";
import destinations from "../content/destinations.json";

export function Home() {
  return (
    <div class="screen home">
      <section class="hero-panel">
        <div class="eyebrow">Tour operations hub · 9 ngày 8 đêm</div>
        <h1>{meta.name}</h1>
        <p class="hero-sub">{meta.subtitle}</p>
        <p class="hero-meta">
          Khởi hành {meta.startDate.split("-").reverse().join("/")} · {meta.route} · Cao nhất {meta.highestAltitude}
        </p>
        <div class="hero-cta">
          <Link href="/lich-trinh" class="btn btn-primary">
            Xem lịch trình 9 ngày
          </Link>
          <Link href="/cam-nang" class="btn btn-ghost">
            Cẩm Nang HDV
          </Link>
        </div>
        <div class="hero-stats"><div><strong>09</strong><span>ngày hành trình</span></div><div><strong>3.650m</strong><span>độ cao Lhasa</span></div><div><strong>5.200m</strong><span>điểm cao nhất</span></div></div>
      </section>

      <section class="start-panel"><div><span class="section-kicker">Bắt đầu nhanh</span><h2>Điều gì cần mở trước khi đoàn khởi hành?</h2><p>Kiểm tra timeline ngày 1, các điểm rủi ro và checklist vận hành — tất cả đều dùng được trên điện thoại.</p></div><div class="start-actions"><Link href="/lich-trinh/ngay-1" class="quick-action">Mở ngày 1 <span>→</span></Link><Link href="/dieu-hanh" class="quick-action">Xem trạng thái đoàn <span>→</span></Link></div></section>

      <section>
        <div class="section-heading"><div><span class="section-kicker">Kho tư liệu</span><h2>Điểm đến nổi bật</h2></div><Link href="/diem-den">Xem toàn bộ →</Link></div>
        <div class="card-grid">
          {destinations.map((d) => (
            <Link key={d.slug} href={`/diem-den/${d.slug}`} class="dest-card">
              <div class="dest-card-place">{d.place}</div>
              <div class="dest-card-name">{d.name}</div>
              <p class="dest-card-desc">{d.quickNarration}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
