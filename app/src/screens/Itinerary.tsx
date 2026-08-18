import { Link } from "../components/Link";
import daysIndex from "../content/days-index.json";

export function Itinerary() {
  return (
    <div class="screen">
      <h1>Lịch Trình 9 Ngày</h1>
      <ol class="day-list">
        {daysIndex.map((d) => (
          <li key={d.day} class="day-list-item">
            <Link href={`/lich-trinh/ngay-${d.day}`} class="day-list-link">
              <span class="day-num">Ngày {d.day}</span>
              <div class="day-info">
                <div class="day-theme">{d.theme}</div>
                <div class="day-sub">
                  {d.altitudeAvg} · {d.emotion}
                </div>
                <div class="day-layer">{d.knowledgeLayer}</div>
              </div>
              {!d.hasDetail && <span class="badge-soon">Đang cập nhật</span>}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
