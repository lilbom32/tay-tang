import { Link } from "../components/Link";
import destinations from "../content/destinations.json";

export function DestinationDetail({ slug }: { slug?: string }) {
  const dest = destinations.find((d) => d.slug === slug);

  if (!dest) {
    return (
      <div class="screen">
        <p>Không tìm thấy điểm đến này.</p>
        <Link href="/diem-den">← Về Điểm Đến</Link>
      </div>
    );
  }

  return (
    <div class="screen">
      <Link href="/diem-den" class="back-link">
        ← Về Điểm Đến
      </Link>
      <div class="eyebrow">{dest.place}</div>
      <h1>{dest.name}</h1>
      <p class="hero-sub">{dest.quickNarration}</p>

      {dest.geography.length > 0 ? (
        <>
          <h2>Bối cảnh địa lý &amp; văn hoá</h2>
          {dest.geography.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </>
      ) : (
        <p class="empty-note">
          Bối cảnh địa lý &amp; script thuyết minh đầy đủ của điểm này đang được chuyển vào app.
        </p>
      )}

      {dest.quickLine && (
        <div class="quick-line">
          <span class="label">Thuyết minh nhanh</span>
          <p>“{dest.quickLine}”</p>
        </div>
      )}

      {dest.hasDiagram && (
        <p class="empty-note">
          Sơ đồ tương tác từng khu vực của {dest.name} sẽ được tích hợp ở giai đoạn kế tiếp
          (xem prototype tại <code>tour/potala_guide_map.html</code>).
        </p>
      )}
    </div>
  );
}
