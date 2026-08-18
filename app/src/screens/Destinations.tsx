import { Link } from "../components/Link";
import destinations from "../content/destinations.json";

export function Destinations() {
  return (
    <div class="screen">
      <h1>Điểm Đến</h1>
      <div class="card-grid">
        {destinations.map((d) => (
          <Link key={d.slug} href={`/diem-den/${d.slug}`} class="dest-card">
            <div class="dest-card-place">{d.place}</div>
            <div class="dest-card-name">{d.name}</div>
            <p class="dest-card-desc">{d.quickNarration}</p>
            {d.hasDiagram && <span class="badge-soon badge-diagram">Có sơ đồ chi tiết</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
