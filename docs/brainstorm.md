# BRAINSTORM — Hệ thống tạo hàng loạt Chứng chỉ · Chứng nhận · Bảng điểm · Tem thư

Trường Chính sách công và Phát triển nông thôn (Bộ Nông nghiệp và Môi trường)
Phiên brainstorm: 17/09/2026 · Chủ dự án: PRD · Trạng thái: đã chốt phần lớn, còn câu hỏi mở ở mục 11.
File này tự chứa: phiên làm việc khác chỉ cần đọc file này (kèm SKILL.md) là đủ để bắt tay xây dựng.

---

## 0. Tóm tắt một đoạn

Web tĩnh chạy trên GitHub Pages, đăng nhập Firebase Auth, dữ liệu lưu Firestore. Người dùng nạp file Excel danh sách lớp (2 sheet: học viên + môn học), hệ thống xem trước và **In** trực tiếp lên phôi chứng chỉ (19 × 13,5 cm) và giấy A5 (bảng điểm), đồng thời **Xuất DOCX** và **Xuất XLSX**. Mọi chứng chỉ đã cấp được lưu lại theo số để tra cứu, in lại, đối soát. Có trang quản lý tem thư chuyển phát (một người có thể nhận thay nhiều người) làm nền cho dự án đối soát gửi thư sau này. Toàn bộ xử lý ở trình duyệt, không có server.

---

## 1. Mục tiêu & phạm vi

- Thay thế quy trình Mail Merge thủ công hiện nay (Word + bảng Word/Excel) bằng một ứng dụng web dùng chung cho quản lý lớp.
- Ba loại văn bản đầu ra: **Chứng chỉ** và **Chứng nhận** (chung một phôi, khác câu chữ và hậu tố số), **Bảng điểm cá nhân** (A5 ngang, chỉ đi kèm chứng chỉ, chứng nhận không cần).
- Đầu ra phụ: **Tem thư** chuyển phát; **bảng điểm lớp** dạng Excel (tổng hợp + từng phần) tự sinh.
- Lưu vết để: in lại theo yêu cầu học viên, đối soát chứng chỉ thật/giả, theo dõi gửi thư (dự án riêng sau này).

## 2. Yêu cầu nghiệp vụ đã ghi nhận (từ PRD)

1. HTML tĩnh trên GitHub Pages riêng; đăng nhập Firebase để bên thứ ba không lấy được dữ liệu.
2. Input là file Excel (.xlsx/.xls) chứa thông tin làm hàng loạt; **số chứng chỉ nằm trong file input**.
3. Tạo và xuất bảng điểm hàng loạt; khi gửi học viên thì gửi chứng chỉ kèm bảng điểm. Chứng nhận không kèm bảng điểm.
4. Firebase lưu lại để rà soát từng học viên (in lại, đối soát chứng chỉ/chứng nhận thật).
5. Tự tạo nhãn (tem) in lên thư chuyển phát: tên học viên, địa chỉ nhận, SĐT — nhập từ **file Excel khác** (quản lý lớp chốt địa chỉ sau; một người có thể nhận thay nhiều người cùng cơ quan/người quen).
6. Multipage với các trang theo nhu cầu: Chỉ chứng chỉ · Chỉ chứng nhận · Chỉ bảng điểm · Chứng chỉ kèm bảng điểm · Quản lý tem thư.
7. Sau này có dự án khác để đối soát: đã gửi cho ai, tình trạng tem thư.
8. **Chứng chỉ và chứng nhận dùng chung một phôi.**
9. Có **Dashboard** quản lý; mỗi trang có nút **In**, **Xuất DOCX**, **Xuất XLSX**; có ô nạp file.
10. Mẫu bảng điểm: bỏ cơ chế Mail Merge, chỉ lấy format để dựng lại.
11. **Font Times New Roman** bắt buộc để đúng thể thức.
12. **Tên người ký luôn nằm trên một dòng.**
13. Định dạng số theo kiểu Việt Nam (dấu phẩy thập phân), khác Excel.
14. **Chuẩn hóa ngày** (mục 6.1) để tránh thêm/sửa số.
15. File Excel nhập liệu có **2 sheet**: sheet 1 danh sách học viên với điểm, sheet 2 danh sách môn.
16. Dashboard có **Mode chọn người ký**: bảng điểm có dùng "TL. Hiệu trưởng" hay không; mặc định tên Hiệu trưởng và Trưởng phòng Đào tạo; cho phép điền tên người ký khác sau này.

## 3. Mẫu 1 — Chứng chỉ / Chứng nhận (file "Chung chi.docx")

**Bản chất:** file Word Mail Merge, nguồn là bảng Word `Chung chi nap.docx` (lớp Chuyên viên K81, ≥39 bản ghi). Merge fields: `HT` (họ tên), `NGÀY`/`THÁNG`/`NĂM` (ngày sinh tách 3 cột), `DVCT` (đơn vị), `SCC` (chỉ phần số; hậu tố `/2026/CC` gõ cứng). Không ảnh, không khung → **in đè lên phôi in sẵn**; nửa trái trang để trống (Quốc huy, chữ CHỨNG CHỈ, ảnh nằm trên phôi). Khoảng trống ~2,3 cm giữa "HIỆU TRƯỞNG" và tên người ký là chỗ ký + đóng dấu.

**Trang:** khổ tùy chỉnh **19,0 × 13,5 cm ngang** (10773 × 7655 twips). Lề: trên 0,95 · phải 1,0 · dưới 0,25 · trái 0,75 cm → vùng chữ 17,25 × 12,3 cm. Times New Roman; cỡ nền 11pt, nội dung 12pt. Layout là *flow* (dòng dài đẩy dòng dưới), không cố định tọa độ.

**Bố cục (tọa độ tính từ lề trái; "tab center" = tâm căn giữa):**

| # | Nội dung | Định dạng |
|---|---|---|
| 1 | Tâm 4,25 cm: "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG" · Tâm 13,25 cm: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" | 11pt, trái nén −0,7pt; phải đậm. Before 8pt |
| 2 | Tâm 4,0 cm: "TRƯỜNG CHÍNH SÁCH CÔNG VÀ PHÁT TRIỂN NÔNG THÔN" · Tâm 13,25 cm: "Độc lập – Tự do – Hạnh phúc" | 11pt nén −1,2pt; phải 12pt đậm gạch chân |
| 3 | Tâm 13,25 cm: "HIỆU TRƯỞNG" / "TRƯỜNG CHÍNH SÁCH CÔNG" / "VÀ PHÁT TRIỂN NÔNG THÔN" | 12pt đậm, giãn dòng cố định 15pt, before 8pt dòng đầu |
| 4 | Khối nội dung thụt trái **9,0 cm** (cột rộng ~8,25 cm), 12pt, before 3pt mỗi dòng: "Chứng nhận Ông (Bà): **{Họ tên}**" · "Sinh ngày {dd} tháng {m} năm {yyyy}" · "Đơn vị công tác:" (dòng riêng) · "**{Đơn vị}**" (đậm, mẫu nén −0,6pt để vừa 1 dòng) · "Đã hoàn thành chương trình: **{Tên chương trình}**" (đậm, justify, thường 2 dòng) · "Từ ngày {dd} tháng {m} năm {yyyy}" · "Đến ngày …" | 12pt |
| 5 | Tâm 13,5 cm: "TP. HCM, ngày {dd} tháng {m} năm {yyyy}" | 12pt **đậm nghiêng**, before 4pt |
| 6 | Tâm 13,5 cm: "HIỆU TRƯỞNG" | 12pt đậm |
| 7 | 3 đoạn trống (~2,3 cm) — ký, đóng dấu | |
| 8 | Thụt 0,5 cm, tâm 4,0 cm: "Số: {n}/{yyyy}/CC" · Tâm 13,5 cm: "**TS. Nguyễn Trung Đông**" | 11pt thường · 12pt đậm |

**Dữ liệu cấp lớp gõ cứng trong mẫu (phải thành tham số):** tên chương trình ("Bồi dưỡng đối với ngạch Chuyên viên và tương đương"), từ/đến ngày, ngày ký (= ngày kết thúc khóa), địa danh "TP. HCM", chức danh + người ký, hậu tố số (`/CC`; chứng nhận dự kiến `/CN` — chờ chốt).

**Chứng nhận:** cùng bố cục, cùng phôi; khác câu chữ (giả định "Đã hoàn thành khóa bồi dưỡng …" — chờ mẫu/câu chữ chính thức) và hậu tố số.

## 4. Mẫu 2 — Bảng điểm cá nhân (file "Bang diem KHỔ A5.docx")

**Trang:** **A5 ngang 21,0 × 14,8 cm**. Lề: trên 0,5 · phải 1,75 · dưới 0,75 · trái 2,25 cm → vùng chữ 17,0 × 13,55 cm. Times New Roman; Normal 12pt; giãn dòng đơn. Mẫu **rất khít trang** (render bằng font thay thế đã tràn tên người ký sang trang 2).

**Bố cục:**

| # | Nội dung | Định dạng |
|---|---|---|
| 1 | Tâm 4,5 cm: "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG" · Tâm 13,25 cm: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" | 9pt; phải đậm |
| 2 | "TRƯỜNG CHÍNH SÁCH CÔNG VÀ PTNT" · "Độc lập - Tự do - Hạnh phúc" (gạch nối thường) | 10pt đậm; gạch chân là 2 đường kẻ vẽ tay 0,75pt dài 2,86 cm và 4,43 cm → HTML dùng border-bottom ngắn căn giữa |
| 3 | Tâm 4,5 cm: "Số: {n}/{yyyy}-ĐT" | 10pt thường, before 6pt. Gõ cứng → có vẻ là số theo lớp (câu hỏi mở) |
| 4 | "BẢNG ĐIỂM" căn giữa | 14pt đậm, before 6pt |
| 5 | Tên lớp căn giữa: "LỚP BỒI DƯỠNG THEO TIÊU CHUẨN CHỨC DANH NGHỀ NGHIỆP VIÊN CHỨC CHUYÊN NGÀNH CHẨN ĐOÁN BỆNH ĐỘNG VẬT – KHÓA 27" | 12pt đậm, before/after 3pt |
| 6 | 4 dòng thông tin, nhãn tại **2,75 cm**, dấu ":" + giá trị tại **5,25 cm**: "Họ và tên : **{Họ tên}**" (tên **13pt đậm**) · "Sinh ngày : {dd/m/yyyy}" · "Đơn vị công tác : {Đơn vị}" · "Khóa học : Từ ngày {dd/m/yyyy} đến ngày {dd/m/yyyy}" | nhãn/giá trị 10pt; before/after 3pt, dòng cuối after 6pt |
| 7 | **Bảng**: thụt trái 0,69 cm; cột **1,5 / 12,25 / 2,0 cm**; viền ngoài **đôi**, viền trong đơn 0,5pt; hàng tiêu đề nền xám 10%, viền dưới đôi: "Số TT" · "Môn học" · "Điểm" (11pt đậm, căn giữa); hàng dữ liệu cao ≥ 0,59 cm, 11pt, vAlign giữa, spacing 1pt; STT và điểm căn giữa, môn học căn trái; điểm dấu phẩy ("7,4") | số hàng = số môn của lớp |
| 8 | Đệm 6pt; "Điểm trung bình chung: **{ĐTB}**" · "Xếp loại: **{Xếp loại}**" thụt trái 2,75 cm | 12pt, before 3pt; ĐTB "7" không phải "7,0" |
| 9 | Khối ký tâm **12,75 cm**: "TP. Hồ Chí Minh, ngày {dd} tháng {m} năm {yyyy}" (10pt **thường, không nghiêng**) · "TL. HIỆU TRƯỞNG" · "TRƯỞNG PHÒNG ĐÀO TẠO" (10pt đậm) · 2 dòng trống · "**TS. Nguyễn Công Bình**" (10pt đậm, **một dòng**) | |
| 10 | Ghi chú bên trái, 9pt nghiêng: "Ghi chú:" (gạch chân) · "Bảng điểm này thay cho sổ điểm. Không cấp lại." (thụt 0,25 cm) | before 2pt |

**Môn học lớp K27 (ví dụ):** "Kiểm tra lần 1: Kiến thức chung" · "Kiểm tra lần 2: Kiến thức kỹ năng, chuyên ngành" · "Tiểu luận cuối khóa"; hệ số 1 · 1 · 2.

**Người ký bảng điểm khác chứng chỉ:** TL. Hiệu trưởng – Trưởng phòng Đào tạo (TS. Nguyễn Công Bình) so với Hiệu trưởng (TS. Nguyễn Trung Đông).

## 5. Mẫu 3 — File Excel bảng điểm lớp ("BANG DIEM LOP DONG VAT-K27 hoàn chỉnh-1.xls")

3 sheet, 33 học viên, mã lớp 64-2026, 15/7–26/8/2026, TNR 13/12, fit 1 trang:

- **"BẢNG ĐIỂM TỔNG HỢP"** (A4 ngang): STT · HỌ VÀ TÊN · NĂM SINH · ĐƠN VỊ CÔNG TÁC · ĐIỂM MÔN 1 · ĐIỂM MÔN 2 · ĐIỂM TIỂU LUẬN · ĐIỂM TRUNG BÌNH `=ROUND((M1+M2+TL*2)/4,1)` · XẾP LOẠI `≥9 Giỏi · ≥7 Khá · ≥5 Trung bình · còn lại "Ko xếp loại"`. Chân trang: chú giải học phần; thống kê giỏi/khá/TB/bảo lưu (gõ tay); ký "CÁN BỘ VÀO ĐIỂM" (Trần Thị Thu Trang) và "PHÒNG ĐÀO TẠO" (Nguyễn Công Bình).
- **"BẢNG ĐIỂM PHẦN 1" / "PHẦN 2"** (A4 dọc): điểm từng môn + cột **bằng chữ gõ tay** ("Bảy phẩy sáu"); ký 3 bên: Cán bộ vào điểm · Giảng viên chấm bài (Lưu Nguyên Trung) · Phòng Đào tạo.
- Một dòng của sheet Tổng hợp = đủ dữ liệu cho một bảng điểm cá nhân.

**Vấn đề chất lượng dữ liệu (hệ thống phải xử lý):**
1. **Ngày sinh lẫn kiểu:** đa số là ô Date định dạng `[$-409]m/d/yyyy` (1975-07-04 hiện "7/4/1975"), vài ô là chuỗi "06/08/1983", "22/10/1983". Không xác định được ngày/tháng có bị hoán đổi khi nhập → rủi ro in sai ngày sinh. Nguồn Mail Merge chứng chỉ tách NGÀY/THÁNG/NĂM chính là để né bẫy này.
2. Khoảng trắng thừa ("Nguyễn Văn Tú ", "…Phú Thọ "), dấu không thống nhất ("Thuỷ"/"Thủy"), lỗi gõ tiêu đề ("HỌ VÀ TẾN"), header sheet Phần 1 ghi "XẾP LOẠI" nhưng chứa bằng chữ.
3. Điểm bằng chữ, thống kê xếp loại gõ tay → app tự sinh.
4. Thông tin lớp nằm trong ô tiêu đề tự do → không parse, nhập qua form.
5. Hai danh sách (chứng chỉ do một người soạn, điểm do người khác) dễ lệch tên/ngày sinh → dùng một file cho một lớp.

## 6. Quy tắc dữ liệu & định dạng (ĐÃ CHỐT)

### 6.1 Ngày tháng — áp dụng mọi nơi (ngày sinh, từ/đến ngày, ngày ký; chứng chỉ lẫn bảng điểm)
- Ngày: luôn **2 chữ số** `01…31`.
- Tháng: **tháng 1 → `01`**; tháng 2–12 → không số 0 (`2`…`12`). *(Yêu cầu PRD, mục đích chống thêm/sửa số.)*
- Năm: 4 chữ số.
- Dạng gạch chéo: `05/01/2001`, `19/3/2001`, `15/7/2026`. Dạng chữ: `ngày 09 tháng 4 năm 1987`.
- **Cấu hình**: thêm lựa chọn "theo NĐ 30/2020" (ngày < 10 **và tháng 1, 2** thêm số 0) vì Nghị định 30/2020/NĐ-CP quy định như vậy cho thể thức văn bản hành chính. Mặc định tạm theo quy tắc PRD; chờ chốt (mục 11).
- Nhập liệu: cột ngày sinh trong Excel là **chuỗi `dd/mm/yyyy`** (cột định dạng Text). App chỉ parse chuỗi hiển thị; ô kiểu Date → cảnh báo đỏ, yêu cầu xác nhận từng ô (hiển thị cả hai cách đọc d/m và m/d).

### 6.2 Số điểm
- Thập phân dùng **dấu phẩy**; bỏ phần lẻ vô nghĩa: `7` chứ không `7,0`; `8,2`; `6,5`.
- ĐTB = ROUND₁( Σ(điểm_i × hệ số_i) / Σ hệ số_i ). Làm tròn nửa lên như Excel: `Math.round(x * 10 + 1e-9) / 10` (epsilon để 7,85 → 7,9 khớp Excel).
- Xếp loại: ngưỡng cấu hình theo chương trình; mặc định theo file K27: ≥9 Giỏi · ≥7 Khá · ≥5 Trung bình · còn lại "Không xếp loại" (cần xác nhận thang chính thức, mục 11).
- Nếu file có sẵn cột ĐTB/Xếp loại: app tính lại và **cảnh báo lệch**, không ghi đè im lặng (bảng điểm lớp đã ký là nguồn sự thật).
- Bằng chữ (cho bảng điểm lớp xuất Excel): `7,6 → "Bảy phẩy sáu"`, `8 → "Tám"`, `8,5 → "Tám phẩy năm"`, `10 → "Mười"`, `6,5 → "Sáu phẩy năm"`.

### 6.3 Chuẩn hóa văn bản
- Trim đầu/cuối, gộp khoảng trắng kép, Unicode NFC. Cảnh báo (không tự sửa) khi tên/đơn vị khác nhau giữa các nguồn chỉ ở dấu ("Thuỷ"/"Thủy").
- Họ tên giữ nguyên hoa/thường như nhập (không tự Title Case vì tên riêng có ngoại lệ).

### 6.4 Kiểm tra trước khi in (validation)
Thiếu họ tên/ngày sinh/số; số trùng trong file; số đã tồn tại trên Firestore; ngày sinh không hợp lệ; điểm ngoài 0–10; thiếu điểm môn; đơn vị/tên chương trình quá dài (app co chữ nhưng vẫn cảnh báo); bảng điểm vượt 1 trang.

### 6.5 Văn bản in
- Font **Times New Roman** ở HTML in, DOCX. App kiểm tra font có trên máy (`document.fonts.check`), chặn in nếu thiếu.
- **Tên người ký luôn 1 dòng** (`white-space: nowrap`), khối ký neo đáy trang; phần trên co chữ (letter-spacing rồi font-size) khi dài.
- Chứng chỉ: hai chỗ hay vỡ là tên đơn vị (1 dòng) và tên chương trình (≤ 2 dòng) → auto-fit thay vì chỉnh tay như mẫu Word.

## 7. Cấu trúc file Excel nhập liệu

### 7.1 File lớp (một file cho một lớp, mọi trang dùng chung) — **2 sheet bắt buộc**

**Sheet `HOC_VIEN`** (dòng 1 là header, tên cột đúng chính tả sau):

| STT | Họ và tên | Ngày sinh | Đơn vị công tác | Số CC/CN | Điểm môn 1 | Điểm môn 2 | … | Điểm môn n | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|

- `Ngày sinh`: chuỗi `dd/mm/yyyy`. `Số CC/CN`: chỉ phần số (879) hoặc đầy đủ (879/2026/CC) — app nhận cả hai, lưu dạng đầy đủ.
- Tên các cột điểm tự do nhưng phải khớp cột "Cột điểm" ở sheet `MON_HOC`.
- Tùy chọn: `ĐTB`, `Xếp loại` để đối chiếu.

**Sheet `MON_HOC`**:

| STT | Tên môn (in trên bảng điểm) | Cột điểm (tên header ở HOC_VIEN) | Hệ số |
|---|---|---|---|
| 1 | Kiểm tra lần 1: Kiến thức chung | Điểm môn 1 | 1 |
| 2 | Kiểm tra lần 2: Kiến thức kỹ năng, chuyên ngành | Điểm môn 2 | 1 |
| 3 | Tiểu luận cuối khóa | Điểm tiểu luận | 2 |

**Sheet `LOP` (tùy chọn, dạng khóa–giá trị)** để điền sẵn form lớp: Loại (CC/CN) · Tên chương trình (câu in trên chứng chỉ) · Tên lớp (dòng in trên bảng điểm) · Mã lớp · Từ ngày · Đến ngày · Địa danh · Ngày ký · Số bảng điểm · Mode người ký CC · Mode người ký BĐ.

App có nút **"Tải file mẫu nhập liệu"** (xlsx có sẵn 3 sheet, cột ngày sinh định dạng Text, data validation điểm 0–10).

### 7.2 File gửi thư (nhập sau, khi quản lý lớp chốt địa chỉ)

**Sheet `GUI_THU`**: Họ và tên HV · Ngày sinh (để khớp) · Người nhận · SĐT · Địa chỉ · Ghi chú. App khớp học viên với lớp theo tên + ngày sinh, **gom theo (Người nhận, SĐT, Địa chỉ)** thành một gói/một nhãn liệt kê đủ tên trong gói, mỗi nhãn tạo một bản ghi `shipments`.

## 8. Kiến trúc kỹ thuật

- **Không server.** HTML/CSS/JS ES modules, **không bước build**; sửa file, push GitHub là chạy. Multipage thật: mỗi trang một file HTML dùng chung module JS/CSS.
- **Thư viện (CDN, ghim phiên bản):** SheetJS `xlsx` (đọc .xls/.xlsx, ghi .xlsx) · `docx` (docx.js, UMD) sinh DOCX từ dữ liệu theo đúng số đo spec · `JSZip` gom nhiều file · Firebase JS SDK modular (Auth + Firestore).
- **In:** `window.print()` với CSS `@page { size: 190mm 135mm; margin: 0 }` cho chứng chỉ, `@page { size: A5 landscape }` cho bảng điểm, A4 cho tem; mọi kích thước bằng mm. **Hiệu chỉnh máy in** dx/dy (mm) lưu theo máy; chế độ in thử lên giấy trắng có khung/đường chuẩn để soi lên phôi.
- **Chứng chỉ kèm bảng điểm:** hai khổ giấy, hai khay → xuất **hai lệnh in cùng thứ tự** để ghép bộ (không trộn một PDF).
- **Xuất DOCX:** sinh từ dữ liệu bằng docx.js với cùng hằng số spec như HTML (một nguồn sự thật). Cũng là **đường in dự phòng**: xuất DOCX → mở Word → in như hiện nay.
- **Xuất XLSX:** danh sách lớp đã gán số; bảng điểm lớp 3 sheet như mẫu K27 (có bằng chữ, thống kê tự tính); danh sách gửi thư; nhật ký in.
- **Font:** TNR lấy từ máy người dùng (Windows/Office). Không nhúng TNR lên repo (font thương mại). Nếu sau này cần PDF sinh bằng JS để gửi email: dùng Tinos (metric-compatible, Apache) hoặc in ra PDF từ trình duyệt.
- **Hosting:** GitHub Pages (repo public không chứa dữ liệu học viên). Phương án phụ: Firebase Hosting (miễn phí, cấu hình Auth domain gọn).
- **Firebase:** Auth (Google hoặc email/mật khẩu) + Firestore gói Spark (50k đọc / 20k ghi mỗi ngày — dư). **Không dùng Cloud Storage** (cần gói Blaze); mẫu/tệp nhỏ để trong repo hoặc base64 trong Firestore.
- **Bảo mật:** apiKey công khai là bình thường; bảo vệ bằng Firestore Security Rules (chỉ email trong `users/` có vai trò mới đọc/ghi), Authorized domains = domain GitHub Pages, tùy chọn App Check. Dữ liệu chỉ nằm trong Firestore.
- **Chống trùng số:** ID document `certificates` = số chứng chỉ chuẩn hóa (`879-2026-CC`); rule `create` chỉ khi chưa tồn tại.

## 9. Mô hình dữ liệu Firestore

| Collection | ID | Trường chính |
|---|---|---|
| `classes` | auto | loai (CC/CN), tenChuongTrinh, tenLop, maLop, tuNgay, denNgay, diaDanh, ngayKy, soBangDiem, monHoc[ {ten, cotDiem, heSo} ], nguongXepLoai, kyCC {mode, chucDanh[], tenNguoiKy}, kyBD {…}, createdBy, createdAt, trangThai |
| `certificates` | số CC/CN chuẩn hóa | classId, hoTen, ngaySinh (chuỗi dd/mm/yyyy), donVi, loai, soDayDu, diem{cot: số}, dtb, xepLoai, trangThai (daCap/inLai/thuHoi), lichSuIn[ {luc, boi, loai} ], createdAt |
| `shipments` | auto | classId, nguoiNhan, sdt, diaChi, certIds[], hocVienNames[], maVanDon, trangThai (chuanBi/daGui/daNhan), sentAt, note |
| `signers` | auto | ten ("TS. Nguyễn Trung Đông"), chucVu, macDinhCho (CC/BD), active |
| `users` | uid | email, ten, vaiTro (admin/quanLyLop), active |
| `settings` | singleton | quyTacThang (prd/nd30), offsetMayIn{ten: {dx,dy}}, diaDanhCC, diaDanhBD, hauToCC, hauToCN |

Tìm kiếm: theo số (ID trực tiếp), theo tên (trường `hoTenKhongDau` lowercase để prefix-search), theo lớp.

## 10. Giao diện

**Trang (multipage):** `index.html` Dashboard · `lop-hoc.html` · `chung-chi.html` · `chung-nhan.html` · `bang-diem.html` · `chung-chi-bang-diem.html` · `tem-thu.html` · `tra-cuu.html` (tìm, in lại, lịch sử) · `cai-dat.html`.

**Dashboard:** thống kê theo lớp (số HV, đã cấp số, đã in, đã gửi thư), lớp gần đây, ô tìm nhanh theo tên/số, lối tắt tới các trang.

**Luồng chuẩn mỗi trang:** nạp file (kéo thả .xls/.xlsx) hoặc chọn lớp đã lưu → bảng kiểm tra lỗi (đỏ/vàng) → chọn dòng → xem trước đúng tỉ lệ (đếm trang) → **Lưu vào hệ thống** → **In** / **Xuất DOCX** / **Xuất XLSX**.

**Mode người ký (Cài đặt + chọn khi in, lưu theo lớp):**
- Chứng chỉ/Chứng nhận: `HIỆU TRƯỞNG` (mặc định TS. Nguyễn Trung Đông) · `KT. HIỆU TRƯỞNG / PHÓ HIỆU TRƯỞNG` (nhập tên) · Tùy chỉnh (chức danh + tên).
- Bảng điểm: `TL. HIỆU TRƯỞNG / TRƯỞNG PHÒNG ĐÀO TẠO` (mặc định TS. Nguyễn Công Bình) · `HIỆU TRƯỞNG` ký trực tiếp · Tùy chỉnh.
- Danh sách người ký thêm/sửa được; mode đã dùng lưu vào `classes` để in lại y như lần đầu.

**Tem thư:** chọn khổ tem (cấu hình: số cột × hàng trên A4, kích thước ô, lề) · nhãn gồm khối người gửi (Trường, địa chỉ, ĐT) + người nhận + SĐT + địa chỉ + "Nội dung: Chứng chỉ lớp … (N bộ): tên…" · In / Xuất XLSX danh sách gửi.

**Tra cứu / In lại:** tìm theo số hoặc tên → xem hồ sơ + lịch sử → in lại (ghi log, đánh dấu "in lại") → sau này dự án đối soát dùng chung collection.

## 11. Câu hỏi còn mở (cần PRD chốt)

1. Số bảng điểm `15/2026-ĐT`: một số cho cả lớp hay mỗi học viên một số? (mẫu gõ cứng → nghiêng về theo lớp)
2. Quy tắc tháng: chỉ tháng 1 có số 0 (PRD) hay tháng 1 và 2 (NĐ 30/2020)?
3. Kích thước phôi thật (19 × 13,5 cm là khổ đặt trong Word) và máy in/khay đang dùng.
4. Chứng nhận: câu chữ chính thức và hậu tố số (`/CN`?).
5. Loại giấy tem (số nhãn/tờ A4, kích thước) và nội dung bắt buộc trên nhãn; có in mã vận đơn/QR không.
6. Thang xếp loại chính thức (file K27 dùng 9/7/5, không có "Xuất sắc").
7. Số người dùng và vai trò (2–3 quản lý lớp thì danh sách email là đủ).
8. Địa danh: giữ "TP. HCM" (chứng chỉ) và "TP. Hồ Chí Minh" (bảng điểm) như mẫu hay thống nhất?
9. Có cần PDF từng học viên để gửi email không, hay chỉ in giấy?
10. Ý tưởng thêm: QR trên bảng điểm dẫn tới trang tra cứu công khai (chỉ hiện số – họ tên – chương trình – ngày cấp) phục vụ đối soát thật/giả — làm hay không?

## 12. Lộ trình đề xuất

- **Giai đoạn 0 — Bản thử in (1 trang HTML, chưa Firebase):** nạp file K27, dựng chứng chỉ 19 × 13,5 và bảng điểm A5 đúng spec, nút In. Mục tiêu: in thử lên phôi + A5, chốt độ khớp bố cục và font, đo offset máy in.
- **Giai đoạn 1 — Ứng dụng đầy đủ:** multipage, Firebase Auth + Firestore, form Lớp học, kiểm tra dữ liệu, Lưu, In, Dashboard, Tra cứu/In lại, mode người ký, cài đặt.
- **Giai đoạn 2 — Xuất & tem thư:** Xuất DOCX (docx.js), Xuất XLSX (bảng điểm lớp 3 sheet, danh sách), Tem thư + `shipments`.
- **Giai đoạn 3 — Dự án đối soát (riêng):** theo dõi gửi/nhận, tra cứu công khai qua QR (nếu chốt).

## 13. Nhật ký quyết định

| Ngày | Quyết định |
|---|---|
| 17/09 | Web tĩnh GitHub Pages + Firebase Auth/Firestore; không server; không Cloud Storage. |
| 17/09 | Chứng chỉ và chứng nhận chung phôi, chung bộ khuôn; khác câu chữ + hậu tố. |
| 17/09 | Bỏ Mail Merge; HTML để xem trước/in; DOCX sinh bằng docx.js từ cùng dữ liệu; XLSX bằng SheetJS. |
| 17/09 | Font Times New Roman bắt buộc; kiểm tra font trước khi in. |
| 17/09 | Tên người ký luôn 1 dòng; khối ký neo đáy trang; auto-fit phần trên. |
| 17/09 | Số: dấu phẩy thập phân, bỏ ",0"; làm tròn kiểu Excel; ĐTB theo hệ số. |
| 17/09 | Ngày: dd luôn 2 số; tháng 1 = 01, tháng ≥2 không 0 (cấu hình thêm lựa chọn NĐ 30). |
| 17/09 | Excel lớp 2 sheet HOC_VIEN + MON_HOC (+ LOP tùy chọn); ngày sinh nhập dạng chuỗi. |
| 17/09 | Mode người ký chọn trên Dashboard, mặc định Hiệu trưởng / Trưởng phòng ĐT, thêm được tên mới. |
| 17/09 | ID `certificates` = số chứng chỉ để chống cấp trùng. |
