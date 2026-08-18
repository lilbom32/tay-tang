# Tây Tạng Huyền Bí

Website/PWA và bộ tài liệu vận hành cho tour Tây Tạng 9 ngày 8 đêm.

## Chạy website

Tại thư mục gốc:

```bash
npm run dev
```

Mở địa chỉ `http://localhost:5173` được hiển thị trong terminal.

## Cấu trúc dự án

| Thư mục | Nội dung |
| --- | --- |
| `app/` | Website Preact/Vite, nội dung tour và kiểm thử giao diện |
| `tour/` | Tài liệu vận hành, tuyến, kịch bản và sơ đồ tour |
| `slides/` | Slide/landing-page tham khảo |
| `skills/` | Quy ước và template biên soạn tài liệu |
| `extracted/` | Văn bản trích xuất từ tài liệu nguồn |
| `books/` | Tài liệu tham khảo cục bộ, không public lên Git |
| `_render_cfm/`, `_render_polished/` | Ảnh render dùng khi biên soạn tài liệu |

## Lệnh hữu ích

```bash
npm run build  # tạo bản production
npm test       # kiểm thử các luồng chính của website
```

## Lưu ý nội dung

Các tệp trong `books/` được giữ cục bộ và bị loại khỏi Git. Không đưa tài liệu có bản quyền hoặc dữ liệu khách hàng vào repository public.
