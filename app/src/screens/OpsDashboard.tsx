import daysIndex from "../content/days-index.json";
import { checkedItems, isOnline } from "../state/store";
import type { DayContent } from "../content/types";

const dayModules = import.meta.glob<{ default: DayContent }>(
  "../content/days/*.json",
  { eager: true }
);

const allDays = Object.values(dayModules)
  .map((m) => m.default)
  .sort((a, b) => a.day - b.day);

export function OpsDashboard() {
  const totalChecklist = allDays.reduce((sum, d) => sum + d.checklist.length, 0);
  const doneChecklist = allDays.reduce(
    (sum, d) => sum + d.checklist.filter((c) => checkedItems.value.has(c.id)).length,
    0
  );
  const riskTouchpoints = allDays.flatMap((d) =>
    d.touchpoints.filter((tp) => tp.type === "risk").map((tp) => ({ day: d.day, tp }))
  );
  const daysWithDetail = daysIndex.filter((d) => d.hasDetail).length;

  return (
    <div class="screen">
      <h1>Bảng Điều Khiển</h1>
      <p class="hero-sub">Tổng quan vận hành cho OPS — không phải nơi soạn nội dung.</p>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">{daysWithDetail}/{daysIndex.length}</div>
          <div class="stat-label">Ngày đã có nội dung chi tiết</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{doneChecklist}/{totalChecklist}</div>
          <div class="stat-label">Checklist đã hoàn tất</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{riskTouchpoints.length}</div>
          <div class="stat-label">Touchpoint rủi ro cao (⚠️)</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{isOnline.value ? "Online" : "Offline"}</div>
          <div class="stat-label">Trạng thái kết nối</div>
        </div>
      </div>

      <h2>Touchpoint rủi ro cao toàn tuyến</h2>
      <ul class="flagged-list">
        {riskTouchpoints.map(({ day, tp }) => (
          <li key={tp.id} class="tp-risk">
            <div class="flagged-head">
              <span class="tp-badge">⚠️</span>
              <span>
                Ngày {day} · {tp.time} · {tp.title}
              </span>
            </div>
            <div class="tp-risk-note">⚠ {tp.risk}</div>
          </li>
        ))}
      </ul>

      <p class="empty-note">
        Dashboard sẽ phong phú hơn khi nội dung Ngày 2–9 được thêm vào (xem kế hoạch triển khai).
      </p>
    </div>
  );
}
