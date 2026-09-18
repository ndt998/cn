# Hệ thống cấp chứng chỉ hàng loạt

Trường Chính sách công và Phát triển nông thôn — Bộ Nông nghiệp và Môi trường.

Web tĩnh, không máy chủ, không bước build. Mở `index.html` bằng Chrome là chạy;
đẩy nguyên thư mục lên GitHub Pages là xong.

## Một file hay nhiều file?

**Nhiều file.** Mỗi trang là một file `.html` riêng, dùng chung `css/` và `js/`. GitHub Pages
chỉ phát file tĩnh nên cứ đẩy nguyên thư mục này lên nhánh là chạy, không cần cấu hình gì.

Vì sao không gom thành một file duy nhất:

- Một file duy nhất tới lúc có đủ chín trang sẽ nặng vài trăm KB, mỗi lần sửa một dòng là
  tải lại toàn bộ; nhiều file thì trình duyệt giữ cache `css/` và `js/`, chỉ tải phần đổi.
- Mỗi trang có địa chỉ riêng nên lưu được vào Bookmark, gửi link cho nhau, nút Quay lại
  của trình duyệt chạy đúng. Một file thì mọi thứ chung một địa chỉ.
- Sửa trang Tem thư không đụng vào trang Chứng chỉ, nên ít rủi ro làm hỏng phần đang in được.
- CSS in của từng loại giấy tách riêng (`print-chung-chi.css`, `print-tem.css`), không chồng lấn.

Cái giá phải trả: khối điều hướng bên trái lặp trong từng file, thêm một trang mới thì phải
chép khối đó. Đổi lại không cần bước build — đúng ràng buộc của dự án.

Cấu trúc trên GitHub Pages:

    https://<tài-khoản>.github.io/<tên-repo>/            → index.html
    https://<tài-khoản>.github.io/<tên-repo>/chung-chi.html
    https://<tài-khoản>.github.io/<tên-repo>/assets/logo.png

Mọi đường dẫn trong mã đều là đường dẫn tương đối nên chạy đúng dù repo tên gì, và chạy
đúng cả khi mở bằng `file://` trên máy.

## Logo

Ghi đè `assets/logo.png` bằng logo thật của Trường là xong, không phải sửa mã. File hiện
tại là logo tạm. Không đặt logo lên phôi chứng chỉ — phôi in sẵn đã có Quốc huy.

## Ai được vào, và ghi vết

- **Danh sách email**: trang Cài đặt → mở chế độ quản trị → thêm email, đặt vai trò
  (quản trị hoặc quản lý lớp), khóa lại khi ai đó nghỉ. Nút *Xuất dạng Firestore* sinh sẵn
  đoạn dữ liệu để dán lên Firestore khi nối Firebase.
- **Nhật ký hoạt động**: trang riêng, chỉ quản trị thấy. Ghi lại việc nạp file, chọn lớp,
  in bao nhiêu bản số nào, đổi cài đặt, thêm và xóa người dùng. Tải về được dạng CSV.

> **Mã quản trị tạm nằm trong `js/quyen.js` và ai xem mã nguồn cũng đọc được.**
> Nó chỉ ngăn bấm nhầm. Trước khi nối Firebase hãy để repo ở chế độ **private**, và đổi
> mã sang giá trị khác với mã đang dùng để thử. Chặn thật nằm ở `firestore.rules` trong
> repo này: Rules chạy trên máy chủ Google, cho mọi người *ghi* nhật ký nhưng chỉ quản trị
> *đọc*, và không ai — kể cả quản trị — sửa hay xóa được dòng đã ghi.

## Chạy thử

- **Nhanh nhất:** nhấp đúp `index.html`. Mọi trang chạy được vì CSS dùng chung nạp
  bằng thẻ `<link>` và mã của từng trang nằm ngay trong trang.
- **Khi thêm Firebase (giai đoạn 1):** phải chạy qua http vì Firebase Auth không làm
  việc với `file://`. Mở terminal ở thư mục này rồi chạy `python -m http.server 8080`
  và vào `http://localhost:8080`.

## Các trang

| Trang | Việc | Tình trạng |
|---|---|---|
| `index.html` | Bảng điều khiển: bốn chặng của lớp, lớp gần đây, tra cứu nhanh | dựng xong, số liệu còn là dữ liệu mẫu |
| `chung-chi.html` | Xem trước và in chứng chỉ lên phôi 19 × 13,5 cm | **chạy được**, bố cục đã đo khớp spec |
| `lop-hoc.html` | Nạp file Excel một lớp, đối chiếu cột, soát lỗi | **chạy được**, đọc đúng ba file thật của Phòng Đào tạo |
| `chung-nhan.html` | Chứng nhận, chung phôi khác câu chữ | chờ chốt câu chữ; in được ngay ở trang chứng chỉ khi chọn loại Chứng nhận |
| `bang-diem.html` | Bảng điểm cá nhân A5 ngang | chờ file mẫu A5 |
| `chung-chi-bang-diem.html` | Hai lệnh in cùng thứ tự để ghép bộ | chưa làm |
| `tem-thu.html` | Nhãn dán bì thư, gộp người nhận thay | **chạy được**; khổ tem chỉnh được trên giao diện |
| `nhat-ky.html` | Nhật ký hoạt động, chỉ quản trị | **chạy được** |
| `tra-cuu.html` | Tìm theo số hoặc tên, in lại có ghi vết | cần Firestore |
| `cai-dat.html` | Người ký, quy tắc tháng, độ lệch máy in, người dùng | chưa làm |

## Cấu trúc

```
index.html … cai-dat.html     mỗi trang một file, vỏ điều hướng lặp trong từng trang
css/app.css                   bộ màu, chữ, khung vỏ dùng chung
css/print-chung-chi.css       tờ chứng chỉ 19 × 13,5 cm — mọi số đo theo spec
js/vo.js                      thu gọn thanh bên, lớp đang làm việc dùng chung
js/spec.js                    số đo tờ chứng chỉ — một nguồn sự thật
js/format.js                  ngày, điểm, số hiệu, xếp loại — một nguồn sự thật
js/nhap-excel.js              đọc file Excel: dò tiêu đề, khớp cột, soát lỗi
js/quyen.js                   danh sách email, vai trò, khóa quản trị tạm
js/nhat-ky.js                 ghi vết hoạt động
css/print-tem.css             nhãn dán bì thư trên giấy A4
firestore.rules               phân quyền thật, bật cùng Firebase ở giai đoạn 1
assets/logo.png               thay bằng logo của Trường
docs/brainstorm.md            nguồn sự thật: yêu cầu, spec, quy tắc, nhật ký quyết định
```

Giai đoạn 1 thêm `js/firebase.js`, `js/db.js`, `js/export-docx.js`, `js/export-xlsx.js`.

## Nạp Excel

Nút **Nạp Excel** có trên thanh trên của mọi trang. Không bắt phải sửa file cho đúng
khuôn: hệ thống tự dò dòng tiêu đề (kể cả khi nằm ở dòng 4 như bảng điểm lớp), tự
khớp tên cột theo bí danh và bỏ dấu khi so khớp, nên `HT`, `HO VA TEN`, `HỌ VÀ TÊN`
và cả lỗi gõ `HỌ VÀ TẾN` đều nhận ra. Dò sai thì sửa tay ở bước 2.

| Cột trong file | Hiểu là | Ghi chú |
|---|---|---|
| `GCN`, `SCC`, `Số CC/CN` | số hiệu | cột tên `GCN` ⇒ chứng nhận, `SCC`/`CC` ⇒ chứng chỉ |
| `HT`, `Họ và tên` | họ và tên | |
| `NS`, `Ngày sinh`, `Năm sinh` | ngày sinh | chỉ đọc khi là **chuỗi** dd/mm/yyyy |
| `DAY`, `MONTH`, `YEAR` | ngày, tháng, năm | nguồn an toàn nhất, ưu tiên dùng |
| `CT`, `DVCT`, `Đơn vị công tác` | đơn vị | |
| `Điểm môn 1`, `Kiểm tra lần 1`, `Tiểu luận`… | cột điểm | khai hệ số ở bước 2, mặc định tiểu luận hệ số 2 |
| `Địa chỉ` (thường là cột H), `SĐT`, `Người nhận` | tem thư | nhiều người cùng địa chỉ gộp thành một nhãn |

Ô ngày sinh kiểu Date của Excel **không bao giờ được đọc ngầm**: hệ thống báo đỏ và
hiện cả hai cách đọc (04/07/1975 hay 07/04/1975) để người dùng xử lý trong Excel trước.
ĐTB được tính lại theo hệ số và đối chiếu với cột ĐTB có sẵn; lệch thì cảnh báo, không
bao giờ ghi đè.

## Thư viện ngoài

Tất cả qua CDN, ghim phiên bản, không có bước cài đặt.

| Thư viện | Phiên bản | Giấy phép | Dùng cho |
|---|---|---|---|
| [Tabler](https://tabler.io) | 1.5.1 | MIT | khung giao diện quản trị trên nền Bootstrap 5 |
| Tabler Icons | 3.46.0 | MIT | các icon, nhúng thẳng dạng SVG nên không tải thêm file |
| Be Vietnam Pro | Google Fonts | SIL OFL 1.1 | chữ giao diện, thiết kế riêng cho dấu tiếng Việt |
| SheetJS CE | 0.20.3 | Apache 2.0 | đọc file Excel `.xls` và `.xlsx` |

SheetJS phải lấy từ `cdn.sheetjs.com`, **không** dùng bản trên npm hay jsDelivr: bản npm
dừng ở 0.18.5 và dính CVE-2023-30533 cùng CVE-2024-22363. Phải là bản `xlsx.full.min.js`
thì mới đọc được `.xls` đời cũ.

Times New Roman **không** nhúng vào repo (font thương mại). Máy in lấy từ Windows;
ứng dụng kiểm tra `document.fonts.check` và báo nếu máy thiếu font.

## Ràng buộc không đổi

Đọc `docs/brainstorm.md` và skill `chung-chi-hang-loat` trước khi sửa. Tóm tắt:
không máy chủ, không bước build, font Times New Roman cho mọi bản in, khổ giấy đúng
mm, tên người ký luôn một dòng, dữ liệu học viên chỉ nằm trong Firestore, số chứng chỉ
làm ID để không thể cấp trùng.

Ngày tháng theo **Nghị định 30/2020/NĐ-CP**: ngày nhỏ hơn 10 và tháng 1, 2 thêm số 0
(`05/01/2001`, `01/02/2026`, `19/3/2026`). Đổi được ở trang Cài đặt.

Hậu tố số hiệu: `/CC` là chứng chỉ, `/GCN` là giấy chứng nhận. Hai loại đi theo hai dãy
số riêng (ví dụ lớp K27 dùng 767–799/CC, danh sách Japfa dùng 2329–2405/GCN).
