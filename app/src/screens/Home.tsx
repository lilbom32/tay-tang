import { Link } from "../components/Link";
import meta from "../content/meta.json";
import destinations from "../content/destinations.json";

export function Home() {
  return (
    <div class="screen home">
      <section class="hero-panel">
        <div class="eyebrow">Cẩm Nang Hướng Dẫn Viên</div>
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
      </section>

      <section>
        <h2>Điểm đến nổi bật</h2>
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
