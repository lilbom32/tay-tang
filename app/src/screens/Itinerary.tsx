import { Link } from "../components/Link";
import daysIndex from "../content/days-index.json";

export function Itinerary() {
  return (
    <div class="screen">
      <div class="page-lead"><span class="section-kicker">Hành trình theo ngày</span><h1>Lịch trình 9 ngày</h1><p>Mỗi ngày được tổ chức theo nhịp vận hành, độ cao và mục tiêu trải nghiệm — chọn một ngày để mở brief hoặc kịch bản chi tiết.</p></div>
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
              <span class={d.hasDetail ? "badge-ready" : "badge-soon"}>{d.hasDetail ? "Có kịch bản" : "Brief hành trình"}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
