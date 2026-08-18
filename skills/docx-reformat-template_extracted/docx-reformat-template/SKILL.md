---
name: docx-reformat-template
description: >
  Áp dụng format/style của một file .docx mẫu (template) lên một file .docx khác mà giữ nguyên nội dung.
  Dùng skill này BẤT CỨ KHI NÀO người dùng:
  - Nói "reformat file này giống file kia", "áp format của A lên B", "giữ nội dung nhưng đổi format theo template"
  - Upload 2 file docx và muốn đồng nhất style giữa chúng
  - Muốn copy font, heading style, logo, cỡ chữ, spacing từ một file sang file khác
  - Nói "format cho giống", "đồng bộ template", "apply style", "chuẩn hóa format theo mẫu"
  Kích hoạt kể cả khi người dùng không nói rõ "skill" hay "reformat" — chỉ cần có 2 file docx và ý định muốn file này trông giống file kia.
---

# DOCX Reformat According to Template

Skill này hướng dẫn quy trình áp dụng format của một file .docx mẫu (template) lên một file .docx nguồn, giữ nguyên toàn bộ nội dung.

> **Trước khi bắt đầu:** Đọc `docx/SKILL.md` để nắm các pattern unpack/edit/pack XML chuẩn.

---

## Quy trình tổng quan

```
Unpack cả 2 file → Phân tích format template → Áp dụng lên source → Pack & validate
```

---

## Bước 1: Unpack cả hai file

```bash
SKILL_BASE=/sessions/<session>/mnt/.claude/skills/docx

python $SKILL_BASE/scripts/office/unpack.py "template.docx" unpacked_template/
python $SKILL_BASE/scripts/office/unpack.py "source.docx"   unpacked_source/
```

---

## Bước 2: Phân tích format của template

Chạy script phân tích để lấy ra các thông tin format quan trọng:

```python
import re

with open('unpacked_template/word/document.xml') as f:
    content = f.read()

paras = re.findall(r'<w:p\b[^>]*>.*?</w:p>', content, re.DOTALL)
for i, p in enumerate(paras[:30]):
    texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, re.DOTALL)
    full_text = ''.join(texts).strip()
    bold   = bool(re.search(r'<w:b(?:\s[^/]*)?/>', p))
    sz     = re.search(r'<w:sz w:val="(\d+)"', p)
    jc     = re.search(r'<w:jc w:val="(\w+)"', p)
    style  = re.search(r'<w:pStyle w:val="([^"]+)"', p)
    font   = re.search(r'<w:rFonts[^>]*w:ascii="([^"]+)"', p)
    print(f'P{i}: "{full_text[:50]}" | bold={bold} sz={sz and sz.group(1)} jc={jc and jc.group(1)} style={style and style.group(1)} font={font and font.group(1)}')
```

**Những gì cần xác định từ template:**
- Font chính (thường là Arial, Calibri, Times New Roman)
- Cỡ chữ body (sz), heading cấp 1, cấp 2, title, subtitle
- Paragraph style IDs cho headings (style="2", "3"...)
- Spacing before/after cho từng loại đoạn
- Có logo/image ở header không? Image rId là gì?
- Có header/footer không?

---

## Bước 3: Phân tích format của source để so sánh

Chạy tương tự trên `unpacked_source/word/document.xml`, xác định:
- Cỡ chữ hiện tại của từng loại (body, heading, title, subtitle)
- Font hiện tại (hoặc thiếu font)
- Có style không hay dùng inline bold/size

**Mapping cỡ chữ thường gặp:**

| Role | Source (thiếu) | Template (đích) |
|------|---------------|-----------------|
| Body text | sz=20 | sz=22 |
| Subtitle | sz=22 | sz=26 |
| Section heading (H1) | sz=24 | sz=28 |
| Main title | sz=28 | sz=32 |

*(Điều chỉnh mapping này theo thực tế của 2 file cụ thể)*

---

## Bước 4: Copy tài nguyên cần thiết từ template

```bash
# 1. Copy styles.xml (heading styles, default font)
cp unpacked_template/word/styles.xml unpacked_source/word/styles.xml

# 2. Copy logo/image nếu template có
mkdir -p unpacked_source/word/media/
cp unpacked_template/word/media/image1.png unpacked_source/word/media/image1.png
```

---

## Bước 5: Viết script Python để áp dụng format

Tạo file `reformat.py` với các bước:

### 5a. Thêm font vào tất cả w:rPr

```python
ARIAL_FONTS = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/>'

def add_font_to_rpr(match):
    rpr = match.group(0)
    if 'w:rFonts' not in rpr:
        rpr = rpr.replace('<w:rPr>', '<w:rPr>' + ARIAL_FONTS, 1)
    return rpr

content = re.sub(r'<w:rPr(?:\s[^/]*)?>.*?</w:rPr>', add_font_to_rpr, content, flags=re.DOTALL)

# Thêm rPr cho các w:r không có rPr
def add_rpr_to_bare_runs(match):
    run = match.group(0)
    if '<w:rPr>' not in run and '<w:rPr/>' not in run:
        run = run.replace('<w:r>', '<w:r><w:rPr>' + ARIAL_FONTS + '</w:rPr>', 1)
    return run

content = re.sub(r'<w:r>.*?</w:r>', add_rpr_to_bare_runs, content, flags=re.DOTALL)
```

### 5b. Điều chỉnh cỡ chữ theo mapping

```python
SIZE_MAP = {20: 22, 22: 26, 24: 28, 28: 32}  # Điều chỉnh theo thực tế

def process_para(match):
    p = match.group(0)
    texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, re.DOTALL)
    full_text = ''.join(texts).strip()
    bold = bool(re.search(r'<w:b(?:\s[^/]*)?/>', p))
    jc_center = 'w:val="center"' in p

    def replace_sz(m):
        val = int(m.group(1))
        # Chỉ điều chỉnh nếu paragraph đúng context
        # sz=22 centered bold → subtitle (26)
        if val == 22 and jc_center and bold:
            return '<w:sz w:val="26"'
        # sz=28 centered bold → title (32)
        if val == 28 and jc_center and bold:
            return '<w:sz w:val="32"'
        # sz=24 bold → section heading (28)
        if val == 24 and bold:
            return '<w:sz w:val="28"'
        # sz=20 → body (22)
        if val == 20:
            return '<w:sz w:val="22"'
        return m.group(0)

    def replace_szcs(m):
        # Mirror logic for szCs
        val = int(m.group(1))
        if val == 22 and jc_center and bold: return '<w:szCs w:val="26"'
        if val == 28 and jc_center and bold: return '<w:szCs w:val="32"'
        if val == 24 and bold: return '<w:szCs w:val="28"'
        if val == 20: return '<w:szCs w:val="22"'
        return m.group(0)

    p = re.sub(r'<w:sz w:val="(\d+)"', replace_sz, p)
    p = re.sub(r'<w:szCs w:val="(\d+)"', replace_szcs, p)
    return p

content = re.sub(r'<w:p\b[^>]*>.*?</w:p>', process_para, content, flags=re.DOTALL)
```

### 5c. Thêm heading style cho section headings

```python
def add_heading_styles(match):
    p = match.group(0)
    texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, re.DOTALL)
    full_text = ''.join(texts).strip()
    sz_match = re.search(r'<w:sz w:val="(\d+)"', p)
    sz = int(sz_match.group(1)) if sz_match else None
    has_bold = bool(re.search(r'<w:b(?:\s[^/]*)?/>', p))
    has_style = 'w:pStyle' in p

    # Heading 1 (sz=28, bold, không có style) → style=2
    if sz == 28 and has_bold and not has_style and full_text:
        if '<w:pPr>' in p:
            p = p.replace('<w:pPr>', '<w:pPr><w:pStyle w:val="2"/>', 1)

    return p

content = re.sub(r'<w:p\b[^>]*>.*?</w:p>', add_heading_styles, content, flags=re.DOTALL)
```

### 5d. Thêm logo image (nếu template có logo mà source dùng text)

Xác định paragraph nào trong source là "institution header" (thường là dòng đầu tiên, centered, chứa tên trường). Thay bằng paragraph chứa image từ template:

```python
# Lấy đoạn image paragraph từ template
LOGO_PARA = """<w:p w14:paraId="XXXXXXXX">
  <w:pPr>
    <w:spacing w:before="0" w:after="80"/>
    <w:jc w:val="center"/>
  </w:pPr>
  <w:r>
    <w:drawing>
      <!-- Paste toàn bộ drawing XML từ unpacked_template/word/document.xml -->
      <!-- Đổi r:embed thành rId của image trong file source -->
    </w:drawing>
  </w:r>
</w:p>"""

# Tìm paragraph đầu tiên (institution header) và replace
first_para = re.search(r'<w:p\b[^>]*>.*?</w:p>', content, re.DOTALL).group(0)
content = content.replace(first_para, LOGO_PARA, 1)
```

---

## Bước 6: Cập nhật relationships và content types

```python
# Thêm image relationship vào unpacked_source/word/_rels/document.xml.rels
# Thêm trước </Relationships>:
# <Relationship Id="rId6" Type=".../image" Target="media/image1.png"/>

# Thêm PNG content type vào [Content_Types].xml nếu chưa có:
# <Default Extension="png" ContentType="image/png"/>
```

---

## Bước 7: Pack và validate

```bash
python $SKILL_BASE/scripts/office/pack.py unpacked_source/ output_reformatted.docx \
  --original "source.docx"
```

Nếu validation pass → copy ra thư mục output. Nếu fail → xem lỗi cụ thể và sửa XML.

---

## Checklist kiểm tra kết quả

Sau khi pack xong, chạy pandoc để verify nhanh:

```bash
pandoc output_reformatted.docx -t markdown | head -60
```

Kiểm tra:
- [ ] Logo image xuất hiện ở đầu (thay vì text institution header)
- [ ] Nội dung giữ nguyên 100% (không mất section nào)
- [ ] Section headings hiển thị đúng cấp bậc
- [ ] Font/cỡ chữ đồng nhất

---

## Lưu ý quan trọng

- **Luôn backup** file source gốc trước khi overwrite
- **Nếu file gốc bị lock (permission denied):** lưu với tên mới có suffix `(Reformatted)`
- **Mapping cỡ chữ phụ thuộc vào từng cặp file** — luôn phân tích thực tế trước khi hardcode
- **Không copy header/footer** từ template nếu nó chứa nội dung course-specific của template (tên môn học, mã môn khác)
- **styles.xml có thể copy toàn bộ** nếu cùng trường/tổ chức → đảm bảo heading style ID khớp nhau
