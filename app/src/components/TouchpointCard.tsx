import { useState } from "preact/hooks";
import type { DayContent, Touchpoint } from "../content/types";

const TYPE_LABEL: Record<Touchpoint["type"], string> = {
  normal: "T",
  risk: "⚠️",
  mot: "★ MOT",
};

const TYPE_CLASS: Record<Touchpoint["type"], string> = {
  normal: "tp-normal",
  risk: "tp-risk",
  mot: "tp-mot",
};

export function TouchpointCard({
  touchpoint,
  day,
}: {
  touchpoint: Touchpoint;
  day: DayContent;
}) {
  const script = touchpoint.scriptRef
    ? day.scripts.find((s) => s.id === touchpoint.scriptRef)
    : undefined;
  const [open, setOpen] = useState(false);

  return (
    <li class={`touchpoint ${TYPE_CLASS[touchpoint.type]}`}>
      <div
        class="touchpoint-head"
        onClick={() => script && setOpen((v) => !v)}
        role={script ? "button" : undefined}
      >
        <span class="tp-time">{touchpoint.time}</span>
        <span class="tp-badge">{TYPE_LABEL[touchpoint.type]}</span>
        <div class="tp-body">
          <div class="tp-title">{touchpoint.title}</div>
          <div class="tp-meta">
            {touchpoint.location} · {touchpoint.actor}
          </div>
        </div>
        {script && <span class="tp-chevron">{open ? "−" : "+"}</span>}
      </div>
      <div class="tp-standard">{touchpoint.standard}</div>
      {touchpoint.risk && <div class="tp-risk-note">⚠ {touchpoint.risk}</div>}
      {script && open && (
        <div class="tp-script">
          <h4>{script.heading}</h4>
          {script.timing && <p class="tp-script-timing">{script.timing}</p>}
          {script.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {script.action && <p class="tp-script-action">→ {script.action}</p>}
        </div>
      )}
    </li>
  );
}
