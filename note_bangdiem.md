# note_bangdiem.md — Hệ thống cấp chứng chỉ hàng loạt

Trường Chính sách công và Phát triển nông thôn · Bộ Nông nghiệp và Môi trường
Cập nhật 18/09/2026 · Chủ dự án: PRD

**File này tự chứa.** Phiên làm việc khác chỉ cần đọc file này là đủ để làm tiếp,
không cần đọc lại `brainstorm.md`. Mọi số đo, quy tắc, bẫy dữ liệu và quyết định
đã gom về đây.

---

## 1. Việc hệ thống phải làm

Thay quy trình Mail Merge thủ công bằng một web tĩnh: nạp file Excel danh sách lớp →
kiểm tra dữ liệu → in đè lên phôi chứng chỉ in sẵn → lưu vết để tra cứu, in lại, đối
soát thật giả. Kèm bảng điểm A5, nhãn dán bì thư, nhật ký hoạt động.

Ba loại văn bản: **Chứng chỉ** và **Chứng nhận** (chung một phôi, khác câu chữ và hậu
tố số), **Bảng điểm cá nhân** A5 ngang (chỉ đi kèm chứng chỉ).

## 2. Trạng thái từng trang

| Trang | Việc | Tình trạng |
|---|---|---|
| `index.html` | Bảng điều khiển: bốn chặng của lớp | dựng xong, số liệu còn là dữ liệu mẫu |
| `lop-hoc.html` | Nạp Excel, đối chiếu cột, soát lỗi | **chạy được** |
| `chung-chi.html` | Xem trước và in chứng chỉ/chứng nhận lên phôi | **chạy được**, đã đo khớp spec |
| `tem-thu.html` | Nhãn dán bì thư | **chạy được** |
| `cai-dat.html` | Email được phép, vai trò, quy tắc tháng, câu chữ | **chạy được** |
| `nhat-ky.html` | Nhật ký hoạt động, chỉ quản trị | **chạy được** |
| `chung-nhan.html` | Trang riêng cho chứng nhận | chưa làm — hiện in ở `chung-chi.html` bằng cách chọn loại |
| `bang-diem.html` | Bảng điểm cá nhân A5 | **chưa làm** — cần file mẫu `Bang diem KHỔ A5.docx` |
| `chung-chi-bang-diem.html` | Hai lệnh in cùng thứ tự để ghép bộ | chưa làm |
| `tra-cuu.html` | Tìm theo số hoặc tên, in lại có ghi vết | chưa làm — cần Firestore |

Chưa có: Firebase (Auth + Firestore), xuất DOCX, xuất XLSX, bảng điểm A5.

## 3. Ràng buộc bất biến, không thương lượng

- **Không máy chủ, không bước build.** HTML/CSS/JS thuần, thư viện qua CDN ghim phiên bản.
- **Đa trang thật**: mỗi trang một file `.html`, dùng chung `css/` và `js/`. Khối điều
  hướng lặp trong từng file — đó là cái giá của việc không có bước build, đã chấp nhận.
- **Font Times New Roman** cho mọi bản in và DOCX. Không nhúng vào repo (font thương mại).
  App gọi `document.fonts.check('12pt "Times New Roman"')` và chặn in nếu thiếu.
- **Khổ giấy đúng mm**: chứng chỉ `190mm × 135mm`, bảng điểm `A5 landscape`, tem `A4`.
- **Tên người ký luôn một dòng**; khối ký neo đáy trang; phần trên auto-fit.
- **Dữ liệu học viên không bao giờ vào repo.** Chỉ Firestore.
- **ID `certificates` = số hiệu chuẩn hóa** (`879/2026/CC` → `879-2026-CC`) → không thể cấp trùng.
- Không thêm khung, logo, Quốc huy vào tờ chứng chỉ — phôi in sẵn đã có.
- Không trộn chứng chỉ (190×135) và bảng điểm (A5) vào một lệnh in.

## 4. Spec tờ chứng chỉ — `css/print-chung-chi.css` + `js/spec.js`

Khổ **190 × 135 mm** ngang. Lề: trên 9,5 · phải 10 · dưới 2,5 · trái 7,5 mm →
vùng chữ **172,5 × 123 mm**. Times New Roman, nền 11pt, nội dung 12pt.

Tọa độ tâm tính từ lề trái (mm), đã đo lại bằng Chromium headless, sai số ≤ 0,01:

| Khối | Tâm | Cỡ |
|---|---|---|
| BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG | 42,5 | 11pt, nén −0,7pt |
| CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM | 132,5 | 11pt đậm |
| TRƯỜNG CHÍNH SÁCH CÔNG VÀ PTNT | 40,0 | 11pt, nén −1,2pt |
| Độc lập – Tự do – Hạnh phúc | 132,5 | 12pt đậm gạch chân |
| HIỆU TRƯỞNG / TRƯỜNG… / VÀ… | 132,5 | 12pt đậm, giãn dòng 15pt |
| Khối nội dung | thụt trái 90,0 · rộng 82,5 | 12pt |
| Địa danh, ngày ký | 135,0 | 12pt đậm nghiêng |
| Chức danh người ký | 135,0 | 12pt đậm |
| Khoảng trống ký và đóng dấu | | **23 mm** |
| Số hiệu | 40,0 | 11pt |
| Tên người ký | 135,0 | 12pt đậm, một dòng |

**Ba cái bẫy đã xử lý, đừng phá:**

1. Tab center của Word cho chữ tràn khỏi cột mà vẫn căn giữa; trình duyệt thì dạt trái.
   Nên mỗi dòng được cấp **một hộp đối xứng quanh đúng tâm** (`margin-left` âm + `width`),
   không dùng cột lưới. Dùng lưới là bốn dòng tiêu đề xuống hai dòng, đẩy khối ký rơi khỏi trang.
2. Dòng "TRƯỜNG CHÍNH SÁCH CÔNG VÀ PHÁT TRIỂN NÔNG THÔN" rộng tự nhiên 106,6 mm, nén
   −1,2pt còn 87,1 mm. **Mức nén trong mẫu là bắt buộc để vừa chỗ**, không phải cho đẹp.
3. Nội dung chiếm 112,6 mm trong 123 mm khi tên chương trình 2 dòng. Sang dòng thứ ba là
   tràn → **giới hạn 2 dòng của auto-fit là ngưỡng sống còn**.

**Auto-fit**: nén ký tự tối đa −1,2pt (đúng mức mẫu Word dùng), sau đó mới hạ cỡ 0,5pt
mỗi bước, sàn 10pt. Áp ở **cấp đoạn**, không ở thẻ đậm bên trong, để chữ đậm chảy liền câu dẫn.

**Khi in**: phải ép `html,body,.vo,.than,.row,.row>*` về đúng bề rộng trang. Không ép thì
khung ứng dụng rộng hơn khổ giấy và Chrome in thừa một tờ trắng. **Tuyệt đối không dùng
`overflow:hidden` trên body** — nó chặn luôn ngắt trang, cả tập in gộp thành một trang.

## 5. Spec nhãn tem — `css/print-tem.css`

Giấy A4. Mặc định 2 cột × 5 hàng = 10 nhãn 105 × 59,4 mm; số cột, số hàng, kích thước,
lề đều chỉnh được trên giao diện vì loại giấy tem chưa chốt.

Nhãn chỉ in **bốn dòng**, không hơn:

    Kính gửi:      <tên học viên>        (đậm)
    Địa chỉ:       <nơi nhận>
    Số điện thoại: <sđt>
    Đơn vị:        <tên đơn vị>

Không in khối người gửi (bao thư của Trường đã có sẵn). **Không in nội dung bên trong
thư** — yêu cầu bảo mật của chủ dự án. Mặc định mỗi học viên một nhãn; có ô bật chế độ
gộp những người cùng địa chỉ vào một nhãn, lúc đó "Kính gửi" liệt kê đủ tên trong gói.

## 6. Quy tắc định dạng — `js/format.js`

```js
fmtDay(d)   -> '01'…'31'
fmtMonth(m) -> 'nd30' (MẶC ĐỊNH): tháng 1, 2 thêm số 0, tháng 3–12 không
               'prd'  (tùy chọn): chỉ tháng 01 có số 0
fmtDateSlash(d,m,y) -> 05/01/2001 · 01/02/2026 · 19/3/2026
fmtDateWords(d,m,y) -> ngày 09 tháng 4 năm 1987
round1(x)   -> Math.round(x*10 + 1e-9)/10        // khớp Excel ROUND(x,1)
fmtScore(x) -> '7' (không '7,0') · '8,2'
dtb(diem[], heSo[]) -> round1(Σ diem·heSo / Σ heSo)
xepLoai(v)  -> ≥9 Giỏi · ≥7 Khá · ≥5 Trung bình · còn lại Không xếp loại
scoreWords(7.6) -> 'Bảy phẩy sáu'
soDayDu('879', 2026, 'CC') -> '879/2026/CC'
loaiTuSo(s) -> có 'GCN' ⇒ 'CN' · có 'CC' ⇒ 'CC'
hauToCua('CN') -> 'GCN'   |   hauToCua('CC') -> 'CC'
```

Quy tắc tháng mặc định theo **Nghị định 30/2020/NĐ-CP**, đổi được ở trang Cài đặt,
lưu trong `localStorage.quyTacThang`.

## 7. File Excel nhập liệu — `js/nhap-excel.js`

Không ép người dùng sửa file. Bộ nạp tự dò dòng tiêu đề trong 15 dòng đầu (dòng nào
khớp được nhiều tên cột nhất), tự khớp cột theo bí danh **sau khi bỏ dấu và viết hoa**,
và cho sửa tay nếu dò sai.

| Bí danh trong file | Hiểu là |
|---|---|
| `GCN`, `SCC`, `SO CC`, `SO` | số hiệu — tên cột `GCN` ⇒ chứng nhận, `SCC`/`CC` ⇒ chứng chỉ |
| `HT`, `HO VA TEN`, `HO TEN` | họ và tên |
| `NS`, `NGAY SINH`, `NAM SINH` | ngày sinh (chỉ đọc khi là **chuỗi** dd/mm/yyyy) |
| `DAY`, `MONTH`, `YEAR` | ngày, tháng, năm tách sẵn — **nguồn an toàn nhất, ưu tiên** |
| `CT`, `DVCT`, `DON VI CONG TAC` | đơn vị |
| `DIEM MON n`, `KIEM TRA LAN n`, `TIEU LUAN` | cột điểm (khai hệ số ở bước 2) |
| `DIA CHI` (thường là cột H), `SDT`, `NGUOI NHAN` | tem thư |

Chân trang chữ ký bị loại bằng luật: dòng không có họ tên, hoặc không có cả số lẫn đơn
vị lẫn ngày → bỏ; ba dòng như vậy liên tiếp → dừng đọc.

## 8. Bẫy dữ liệu có thật, đã gặp trong file của Phòng

1. **Ô ngày sinh kiểu Date**: file `BANG DIEM LOP DONG VAT-K27` có 30/33 ô ngày sinh là
   Date của Excel, hiển thị `7/4/75` — không thể biết ngày hay tháng trước. Hệ thống
   **báo đỏ và hiện cả hai cách đọc**, không bao giờ tự đoán. Ba cột DAY/MONTH/YEAR trong
   file GCN chính là cách Phòng đã tự né bẫy này từ trước.
2. **Lỗi gõ trong tiêu đề**: `HỌ VÀ TẾN` thay vì `HỌ VÀ TÊN` ở 2/3 sheet. Bỏ dấu khi so
   khớp nên vẫn nhận ra.
3. **Tiêu đề không ở dòng 1**: bảng điểm lớp có tiêu đề ở dòng 4.
4. **File bảng điểm không có cột số hiệu** — đó là chuyện bình thường, không phải lỗi
   33 dòng. Hệ thống báo một câu, không đánh dấu đỏ từng dòng.
5. **Hai nguồn lệch nhau**: cùng lớp K27, **Dương Thị Hoa (số 769)** có điểm môn 2 là
   7,6 ở bảng điểm lớp nhưng 7,4 ở bảng nạp chứng chỉ → ĐTB 8,1 so với 8,0. Một trong hai
   con số đã lên bảng điểm đã ký. Vì vậy ĐTB luôn được **tính lại theo hệ số và đối chiếu**
   với cột có sẵn; lệch thì cảnh báo, **không bao giờ ghi đè**.
6. Hai loại văn bản đi **hai dãy số riêng**: lớp K27 dùng 767–799/CC, danh sách Japfa dùng
   2329–2405/GCN.

## 9. Phân quyền và nhật ký

**Admin cần đủ hai lớp**, không phải một:

1. Email đang dùng phải nằm trong danh sách với vai trò quản trị và còn hoạt động.
2. Nhập đúng mã quản trị.

Đúng mã mà sai email thì vẫn không vào được. Đổi sang email khác thì quyền mất ngay,
bị hạ vai trò khi đang mở cũng mất ngay. Không cho hạ vai trò hay xóa **quản trị cuối cùng**.
Ngoại lệ duy nhất: danh sách còn rỗng thì mã một mình mở được, để lập admin đầu tiên —
có admin rồi thì ngoại lệ tự mất.

> **Mã quản trị tạm nằm trong `js/quyen.js`, ai xem mã nguồn cũng đọc được.** Nó chỉ ngăn
> bấm nhầm. Repo phải để **private** cho tới khi nối Firebase. Mã `159753` đã đi qua tin
> nhắn nên coi như lộ, phải đổi trước khi dùng thật.

**Nhật ký** ghi: nạp file, chọn lớp, in bao nhiêu bản số nào, đổi cài đặt, thêm/sửa/xóa
người dùng, vào và thoát chế độ quản trị. Giai đoạn 0 lưu `localStorage` (tối đa 1000
dòng). Giai đoạn 1 vào Firestore với Rules: ai cũng **ghi** được, chỉ quản trị **đọc**,
và **không ai sửa hay xóa được** — kể cả quản trị. Có vậy dấu vết mới đáng tin.

`firestore.rules` đã viết sẵn trong repo, bật cùng lúc với Firebase Auth.

## 10. Cấu trúc repo và thư viện

```
index.html · lop-hoc.html · chung-chi.html · chung-nhan.html · bang-diem.html
chung-chi-bang-diem.html · tem-thu.html · tra-cuu.html · cai-dat.html · nhat-ky.html
css/app.css · css/print-chung-chi.css · css/print-tem.css
js/vo.js · js/spec.js · js/format.js · js/nhap-excel.js · js/quyen.js · js/nhat-ky.js
assets/logo.png          ← ghi đè bằng logo thật của Trường
firestore.rules · README.md · README_HDSD.txt · note_bangdiem.md
```

`js/*.js` là script cổ điển gắn vào `window` (không phải ES module) để mở được bằng
`file://` lúc thử in. Mã riêng của từng trang nằm inline trong trang đó.

| Thư viện | Bản | Giấy phép | Ghi chú |
|---|---|---|---|
| Tabler | 1.5.1 | MIT | khung giao diện, CDN jsDelivr |
| Tabler Icons | 3.46.0 | MIT | nhúng thẳng SVG, không tải font icon |
| Be Vietnam Pro | Google Fonts | OFL 1.1 | chữ giao diện, dấu tiếng Việt chuẩn |
| SheetJS CE | 0.20.3 | Apache 2.0 | **phải lấy từ `cdn.sheetjs.com`, bản `full`** |

SheetJS trên npm/jsDelivr dừng ở 0.18.5 và dính CVE-2023-30533 + CVE-2024-22363. Chỉ
bản `xlsx.full.min.js` mới đọc được `.xls` đời cũ của Phòng.

## 11. Kiểm tra bắt buộc trước khi báo xong

Sandbox có Playwright và font Liberation Serif (trùng metric Times New Roman).

1. In ra PDF bằng Chromium headless `page.pdf({prefer_css_page_size:True})`, kiểm tra:
   đúng khổ trang, **mỗi văn bản đúng một trang**, tên người ký một dòng, khoảng ký ≥ 2 cm.
2. So 15 mốc tọa độ với bảng ở mục 4 (hàm `window.__probe()` trong `chung-chi.html`).
3. Chạy bộ kiểm thử `format.js`: ngày 01/01, 05/3, 19/12; `round1(7.85)=7.9`;
   `fmtScore(7)='7'`; `scoreWords`.
4. Nạp thử ba file thật, không chỉ dữ liệu mẫu.
5. Rà lỗi JS và liên kết hỏng trên **mọi** trang, không chỉ trang vừa sửa.

## 12. Nhật ký quyết định

| Ngày | Quyết định |
|---|---|
| 17/09 | Web tĩnh GitHub Pages + Firebase Auth/Firestore; không máy chủ; không Cloud Storage. |
| 17/09 | Chứng chỉ và chứng nhận chung phôi, chung bộ khuôn; khác câu chữ + hậu tố. |
| 17/09 | Bỏ Mail Merge; HTML để xem trước và in; DOCX sinh bằng docx.js; XLSX bằng SheetJS. |
| 17/09 | Font Times New Roman bắt buộc; kiểm tra font trước khi in. |
| 17/09 | Số: dấu phẩy thập phân, bỏ ",0"; làm tròn kiểu Excel; ĐTB theo hệ số. |
| 17/09 | ID `certificates` = số chứng chỉ để chống cấp trùng. |
| 18/09 | Tab center dựng bằng hộp đối xứng quanh tâm, không dùng cột lưới. |
| 18/09 | Auto-fit: nén tối đa −1,2pt rồi hạ cỡ 0,5pt/bước, sàn 10pt; áp ở cấp đoạn. |
| 18/09 | Khoảng ký cố định 23 mm, khối ký neo đáy trang, có công tắc tắt để đối chiếu mẫu Word. |
| 18/09 | Giao diện Tabler 1.5.1 qua CDN, màu xanh lá công vụ, chữ Be Vietnam Pro, icon SVG nhúng. |
| 18/09 | Đa trang thật trên GitHub Pages, không gộp một file; logo đọc từ `assets/logo.png`. |
| 18/09 | Thanh bên thu gọn được, nhớ trạng thái theo máy. Nút Nạp Excel có trên mọi trang. |
| 18/09 | Hậu tố chứng nhận là `/GCN`; loại văn bản đoán từ cột số hiệu; hai loại hai dãy số riêng. |
| 18/09 | Bỏ yêu cầu file Excel phải có sheet HOC_VIEN/MON_HOC; tự dò tiêu đề và khớp cột. |
| 18/09 | Ngày sinh ưu tiên ba cột DAY/MONTH/YEAR; ô Date báo đỏ kèm hai cách đọc, không tự quyết. |
| 18/09 | SheetJS 0.20.3 bản full từ cdn.sheetjs.com. |
| 18/09 | **Quy tắc tháng mặc định theo NĐ 30/2020**; quy ước cũ của Phòng giữ làm tùy chọn. |
| 18/09 | Câu chữ chứng nhận giữ bản tạm "Đã hoàn thành khóa bồi dưỡng:", sửa được ở Cài đặt và ở từng lớp. |
| 18/09 | Có nhật ký hoạt động, chỉ admin đọc; Rules cho ghi, cấm sửa xóa. |
| 18/09 | **Admin phải đủ hai lớp: email có vai trò quản trị + đúng mã.** Giữ nguyên sau khi nối Firebase. |
| 18/09 | Nhãn tem chỉ bốn dòng: người nhận, địa chỉ, SĐT, đơn vị. Không in người gửi, không in nội dung thư. |

## 13. Câu hỏi còn mở

1. Số bảng điểm `15/2026-ĐT`: một số cho cả lớp hay mỗi học viên một số?
2. Kích thước phôi thật và máy in/khay đang dùng (cần để chốt độ lệch dx/dy).
3. Loại giấy tem: mấy nhãn một tờ A4, kích thước mỗi nhãn.
4. Thang xếp loại chính thức (file K27 dùng 9/7/5, không có "Xuất sắc").
5. Địa danh: giữ "TP. HCM" trên chứng chỉ và "TP. Hồ Chí Minh" trên bảng điểm, hay thống nhất?
6. Có cần PDF từng học viên để gửi email không, hay chỉ in giấy?
7. QR trên bảng điểm dẫn tới trang tra cứu công khai để đối soát thật giả — làm hay không?

## 14. Việc tiếp theo, theo thứ tự đề xuất

1. **Bảng điểm A5** — cần file mẫu `Bang diem KHỔ A5.docx` để đối chiếu số đo trước khi dựng.
2. **Nối Firebase** — Auth + Firestore + bật `firestore.rules`; lúc đó mã admin tạm biến
   mất khỏi vai trò xác thực, nhật ký thành bất biến, tra cứu và in lại chạy được.
3. **Xuất DOCX** bằng docx.js dùng chung `js/spec.js` — cũng là đường in dự phòng.
4. **Xuất XLSX** bảng điểm lớp ba sheet như mẫu K27, có bằng chữ và thống kê tự tính.
5. Trang tra cứu, in lại có ghi vết; dự án đối soát gửi thư.
