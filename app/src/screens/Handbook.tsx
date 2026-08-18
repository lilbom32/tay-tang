import { useState } from "preact/hooks";
import goldenRules from "../content/golden-rules.json";
import type { DayContent } from "../content/types";

const dayModules = import.meta.glob<{ default: DayContent }>(
  "../content/days/*.json",
  { eager: true }
);

const allDays = Object.values(dayModules)
  .map((m) => m.default)
  .sort((a, b) => a.day - b.day);

const flaggedTouchpoints = allDays.flatMap((day) =>
  day.touchpoints
    .filter((tp) => tp.type !== "normal")
    .map((tp) => ({ day: day.day, dayTitle: day.title, tp }))
);

type Filter = "all" | "rules" | "flagged";

export function Handbook() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div class="screen">
      <h1>Cẩm Nang HDV</h1>
      <p class="hero-sub">
        Bộ lọc kiến thức cắt ngang: quy tắc vàng áp dụng mọi lúc, và các khoảnh khắc rủi ro / MOT
        theo từng ngày — thay vì phải đọc lại toàn bộ tài liệu.
      </p>

      <div class="filter-tabs">
        <button class={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
          Tất cả
        </button>
        <button class={filter === "rules" ? "on" : ""} onClick={() => setFilter("rules")}>
          10 Quy Tắc Vàng
        </button>
        <button class={filter === "flagged" ? "on" : ""} onClick={() => setFilter("flagged")}>
          MOT &amp; Rủi Ro
        </button>
      </div>

      {(filter === "all" || filter === "rules") && (
        <section>
          <h2>10 Quy Tắc Vàng</h2>
          <ol class="rule-list">
            {goldenRules.map((r) => (
              <li key={r.id}>{r.text}</li>
            ))}
          </ol>
        </section>
      )}

      {(filter === "all" || filter === "flagged") && (
        <section>
          <h2>Khoảnh Khắc MOT &amp; Rủi Ro</h2>
          {flaggedTouchpoints.length === 0 && (
            <p class="empty-note">Chưa có dữ liệu — sẽ đầy đủ khi các ngày còn lại được thêm vào.</p>
          )}
          <ul class="flagged-list">
            {flaggedTouchpoints.map(({ day, dayTitle, tp }) => (
              <li key={tp.id} class={tp.type === "mot" ? "tp-mot" : "tp-risk"}>
                <div class="flagged-head">
                  <span class="tp-badge">{tp.type === "mot" ? "★ MOT" : "⚠️"}</span>
                  <span>
                    Ngày {day} · {tp.time} · {tp.title}
                  </span>
                </div>
                <div class="tp-meta">{tp.location} — {dayTitle}</div>
                {tp.risk && <div class="tp-risk-note">⚠ {tp.risk}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
