import { Link } from "../components/Link";
import daysIndex from "../content/days-index.json";
import { TouchpointCard } from "../components/TouchpointCard";
import { checkedItems, toggleChecked } from "../state/store";
import type { DayContent } from "../content/types";

const dayModules = import.meta.glob<{ default: DayContent }>(
  "../content/days/*.json",
  { eager: true }
);

const daysBySlug = new Map<string, DayContent>();
for (const mod of Object.values(dayModules)) {
  daysBySlug.set(mod.default.slug, mod.default);
}

export function DayDetail({ daySlug }: { daySlug?: string }) {
  const day = daySlug ? daysBySlug.get(daySlug) : undefined;
  const dayNum = daySlug ? Number(daySlug.replace("ngay-", "")) : NaN;
  const summary = daysIndex.find((d) => d.day === dayNum);

  if (!summary) {
    return (
      <div class="screen">
        <p>Không tìm thấy ngày này.</p>
        <Link href="/lich-trinh">← Về lịch trình</Link>
      </div>
    );
  }

  if (!day) {
    return (
      <div class="screen">
        <Link href="/lich-trinh" class="back-link">
          ← Về lịch trình
        </Link>
        <h1>Ngày {summary.day}: {summary.theme}</h1>
        <div class="day-header-grid">
          <div>
            <span class="label">Độ cao</span> {summary.altitudeAvg}
          </div>
          <div>
            <span class="label">Cảm xúc</span> {summary.emotion}
          </div>
          <div>
            <span class="label">Layer tri thức</span> {summary.knowledgeLayer}
          </div>
        </div>
        <p class="empty-note">
          Nội dung chi tiết (script thuyết minh, timeline touchpoint, checklist) của ngày này
          đang được chuyển từ tài liệu gốc vào app — xem tạm trong <Link href="/cam-nang">Cẩm Nang HDV</Link>.
        </p>
      </div>
    );
  }

  return (
    <div class="screen">
      <Link href="/lich-trinh" class="back-link">
        ← Về lịch trình
      </Link>
      <h1>Ngày {day.day}: {day.title}</h1>
      <div class="day-header-grid">
        <div>
          <span class="label">Tuyến</span> {day.route}
        </div>
        <div>
          <span class="label">Độ cao TB</span> {day.altitudeAvg}
        </div>
        <div>
          <span class="label">Cảm xúc</span> {day.emotion}
        </div>
        <div>
          <span class="label">Layer tri thức</span> {day.knowledgeLayer}
        </div>
      </div>
      <p class="day-mission">{day.mission}</p>

      <h2>Timeline</h2>
      <ul class="touchpoint-list">
        {day.touchpoints.map((tp) => (
          <TouchpointCard key={tp.id} touchpoint={tp} day={day} />
        ))}
      </ul>

      <h2>Checklist</h2>
      <ul class="checklist">
        {day.checklist.map((item) => {
          const checked = checkedItems.value.has(item.id);
          return (
            <li key={item.id}>
              <label class={checked ? "checked" : ""}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleChecked(item.id)}
                />
                {item.text}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
