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
        <section class="potala-guide">
          <span class="section-kicker">Công trình & tuyến tham quan</span>
          <h2>Đọc Potala theo ba lớp</h2>
          <div class="potala-facts"><div><span>Vị trí</span><strong>Đồi Marpo Ri · Lhasa</strong><p>Khoảng 3.700m, trung tâm thung lũng Lhasa.</p></div><div><span>Khởi công</span><strong>1645</strong><p>Dưới thời Đạt Lai Lạt Ma thứ 5, trên nền cung điện thế kỷ 7.</p></div><div><span>Di sản</span><strong>UNESCO · 1994</strong><p>Thuộc Quần thể kiến trúc lịch sử Potala.</p></div></div>
          <div class="potala-grid"><article><span class="section-kicker">01 · Kiến trúc</span><h3>Bạch Cung</h3><p>Hoàn thành năm 1649; là không gian sinh hoạt, làm việc và tiếp kiến của các đời Đạt Lai Lạt Ma.</p></article><article><span class="section-kicker">02 · Tâm linh</span><h3>Hồng Cung</h3><p>Hoàn thành giai đoạn 1690–1694; là trung tâm nghi lễ với điện thờ, bảo tháp và các không gian thờ tự.</p></article><article><span class="section-kicker">03 · Hạt nhân lịch sử</span><h3>Hai gian thế kỷ 7</h3><p>Phakpa Lhakhang và Chogyel Drupuk là chìa khóa để hiểu Potala không chỉ là công trình thế kỷ 17.</p></article></div>
          <div class="visit-note"><div><span class="section-kicker">Brief vận hành</span><h3>Điểm cần nhắc đoàn trước khi vào</h3><ul><li>Vé gắn với hộ chiếu từng người; kiểm tra từ khách sạn.</li><li>Khung giờ vào cố định — đến trước ít nhất 15 phút.</li><li>Đường dốc và bậc đá: đi chậm, không vừa đi vừa dùng điện thoại.</li><li>Chốt điểm tập hợp trước khi vào; trợ lý đi cuối đoàn.</li></ul></div><a class="btn btn-primary" href="/potala-guide-map.html" target="_blank" rel="noreferrer">Mở sơ đồ tham quan →</a></div>
        </section>
      )}
    </div>
  );
}
