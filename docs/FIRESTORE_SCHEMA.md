# Cấu trúc dữ liệu Firestore & Schema Design

## Tổng quan
Hệ thống sử dụng Firebase Firestore làm database, với kiến trúc không server (client-side only). Dữ liệu được tổ chức thành các collection như sau:

---

## 1. Collection `users` — Quản lý người dùng nội bộ

**Mục đích:** Lưu thông tin người được phép truy cập hệ thống (chỉ người nội bộ).

**ID document:** `uid` (Firebase Auth UID)

**Schema:**
```javascript
{
  email: string,          // Email duy nhất, dùng để đối soát
  ten: string,            // Tên hiển thị
  vaiTro: string,         // 'admin' | 'quanLyLop'
  active: boolean,        // true = còn hoạt động, false = đã khóa
  createdAt: timestamp,   // Thời điểm tạo
  createdBy: string       // UID của admin tạo user này
}
```

**Quy tắc truy cập:**
- Đọc: Chỉ admin đọc được tất cả, mỗi user đọc được chính mình
- Ghi: Chỉ admin mới được thêm/sửa/xóa

---

## 2. Collection `classes` — Quản lý lớp học

**Mục đích:** Lưu thông tin lớp học đã qua xử lý, dùng để tái sử dụng và in lại.

**ID document:** Auto-generated ID

**Schema:**
```javascript
{
  loai: string,                    // 'CC' (Chứng chỉ) | 'CN' (Chứng nhận)
  tenChuongTrinh: string,          // Tên chương trình in trên chứng chỉ
  tenLop: string,                  // Tên lớp in trên bảng điểm
  maLop: string,                   // Mã lớp (ví dụ: "64-2026")
  tuNgay: string,                  // dd/mm/yyyy
  denNgay: string,                 // dd/mm/yyyy
  diaDanh: string,                 // "TP. HCM" hoặc "TP. Hồ Chí Minh"
  ngayKy: string,                  // dd/mm/yyyy (thường = ngày kết thúc)
  soBangDiem: string,              // Số bảng điểm (ví dụ: "15/2026-ĐT")
  
  monHoc: [                        // Danh sách môn học
    {
      ten: string,                 // Tên môn in trên bảng điểm
      cotDiem: string,             // Tên cột trong sheet HOC_VIEN
      heSo: number                 // Hệ số (1, 2, ...)
    }
  ],
  
  nguonXepLoai: {                  // Ngưỡng xếp loại
    gioi: number,                  // Mặc định: 9.0
    kha: number,                   // Mặc định: 7.0
    trungBinh: number              // Mặc định: 5.0
  },
  
  kyCC: {                          // Cấu hình người ký chứng chỉ/chứng nhận
    mode: string,                  // 'hieuTruong' | 'ktHieuTruong' | 'tuyChinh'
    chucDanh: [string],            // ["HIỆU TRƯỞNG"] hoặc ["KT. HIỆU TRƯỞNG", "PHÓ HIỆU TRƯỞNG"]
    tenNguoiKy: string             // "TS. Nguyễn Trung Đông"
  },
  
  kyBD: {                          // Cấu hình người ký bảng điểm
    mode: string,                  // 'tlHieuTruong' | 'hieuTruong' | 'tuyChinh'
    chucDanh: [string],            // ["TL. HIỆU TRƯỞNG", "TRƯỞNG PHÒNG ĐÀO TẠO"]
    tenNguoiKy: string             // "TS. Nguyễn Công Bình"
  },
  
  createdBy: string,               // UID người tạo
  createdAt: timestamp,
  updatedAt: timestamp,
  trangThai: string                // 'hoanThanh' | 'dangXuLy' | 'daXoa'
}
```

---

## 3. Collection `certificates` — Chứng chỉ & Chứng nhận đã cấp

**Mục đích:** Lưu vết chứng chỉ đã cấp, chống cấp trùng số, hỗ trợ tra cứu và in lại.

**ID document:** Số chứng chỉ chuẩn hóa (định dạng: `{so}-{nam}-{loai}`)
- Ví dụ: `"879-2026-CC"` hoặc `"123-2026-CN"`

**Schema:**
```javascript
{
  classId: string,                 // Reference đến classes/{id}
  
  hoTen: string,                   // Họ tên đầy đủ
  ngaySinh: string,                // Chuỗi dd/mm/yyyy (không parse)
  donVi: string,                   // Đơn vị công tác
  
  loai: string,                    // 'CC' | 'CN'
  soDayDu: string,                 // Số đầy đủ (ví dụ: "879/2026/CC")
  soChiTiet: {                     // Tách riêng để dễ xử lý
    so: string,                    // "879"
    nam: string,                   // "2026"
    loai: string                   // "CC" hoặc "CN"
  },
  
  diem: {                          // Điểm từng môn
    "mon1": number,
    "mon2": number,
    "tieuluan": number
  },
  
  dtb: number,                     // Điểm trung bình (làm tròn 1 thập phân)
  xepLoai: string,                 // "Giỏi" | "Khá" | "Trung bình" | "Không xếp loại"
  
  trangThai: string,               // 'daCap' | 'inLai' | 'thuHoi'
  
  lichSuIn: [                      // Lịch sử in
    {
      luc: timestamp,              // Thời điểm in
      boi: string,                 // Bối cảnh: "lanDau" | "traCuu" | "yeuCauHV"
      loai: string                 // "chungChi" | "bangDiem" | "caHai"
    }
  ],
  
  createdAt: timestamp,
  createdBy: string                // UID người tạo
}
```

**Lưu ý quan trọng:**
- ID document = số chuẩn hóa → Firestore tự động chống trùng
- Không bao giờ xóa, chỉ đổi `trangThai` sang `thuHoi`
- Trường `hoTenKhongDau` (lowercase) có thể thêm để search nhanh

---

## 4. Collection `shipments` — Quản lý tem thư chuyển phát

**Mục đích:** Theo dõi việc gửi chứng chỉ/bảng điểm qua đường bưu điện.

**ID document:** Auto-generated ID

**Schema:**
```javascript
{
  classId: string,                 // Reference đến classes/{id}
  
  nguoiNhan: string,               // Tên người nhận (có thể nhận thay)
  sdt: string,                     // Số điện thoại
  diaChi: string,                  // Địa chỉ nhận
  
  certIds: [string],               // Danh sách số chứng chỉ trong gói
  hocVienNames: [string],          // Danh sách tên học viên trong gói
  
  maVanDon: string,                // Mã vận đơn (nếu có)
  trangThai: string,               // 'chuanBi' | 'daGui' | 'daNhan'
  
  sentAt: timestamp,               // Thời điểm gửi
  note: string,                    // Ghi chú
  
  createdBy: string,
  createdAt: timestamp
}
```

**Quy tắc gom gói:**
- Một người có thể nhận thay nhiều học viên cùng cơ quan
- Gom theo `(nguoiNhan, sdt, diaChi)` → một nhãn tem

---

## 5. Collection `signers` — Danh sách người ký

**Mục đích:** Quản lý danh sách người ký có thể chọn khi in.

**ID document:** Auto-generated ID

**Schema:**
```javascript
{
  ten: string,                     // "TS. Nguyễn Trung Đông"
  chucVu: string,                  // "Hiệu trưởng" | "Trưởng phòng Đào tạo"
  macDinhCho: [string],            // ["CC"] | ["BD"] | ["CC", "BD"]
  active: boolean,                 // Còn sử dụng được không
  
  createdAt: timestamp,
  createdBy: string
}
```

---

## 6. Collection `settings` — Cấu hình hệ thống

**Mục đích:** Lưu các cài đặt toàn cục, singleton (chỉ 1 document).

**ID document:** `"config"` (cố định)

**Schema:**
```javascript
{
  quyTacThang: string,             // 'prd' | 'nd30'
                                   // prd: tháng 1 = 01, tháng >=2 không 0
                                   // nd30: tháng 1,2 đều có số 0
  
  offsetMayIn: {                   // Hiệu chỉnh máy in theo tên máy
    "{tenMayIn}": {
      dx: number,                  // Offset X (mm)
      dy: number                   // Offset Y (mm)
    }
  },
  
  diaDanhCC: string,               // "TP. HCM" (mặc định cho chứng chỉ)
  diaDanhBD: string,               // "TP. Hồ Chí Minh" (mặc định cho bảng điểm)
  
  hauToCC: string,                 // "/CC" (mặc định)
  hauToCN: string,                 // "/CN" (mặc định)
  
  updatedAt: timestamp,
  updatedBy: string
}
```

---

## 7. Collection `nhat_ky` — Nhật ký hoạt động

**Mục đích:** Ghi lại mọi thao tác quan trọng để audit, chỉ admin đọc được.

**ID document:** Auto-generated ID

**Schema:**
```javascript
{
  uid: string,                     // UID người thực hiện
  email: string,                   // Email để đối soát
  hanhDong: string,                // "taoLop" | "capChungChi" | "inLai" | ...
  doiTuong: string,                // Mô tả đối tượng tác động
  luc: timestamp,                  // Thời điểm (phải trùng request.time)
  chiTiet: map                     // Dữ liệu liên quan
}
```

**Quy tắc đặc biệt:**
- Ai cũng ghi được (nhưng phải đúng UID của mình)
- **Chỉ admin đọc được**
- **Không ai sửa/xóa được** (kể cả admin) → đảm bảo tính toàn vẹn

---

## 8. Indexes cần thiết

```javascript
// certificates
certificates: [
  { fieldPath: "classId", order: "ASCENDING" },
  { fieldPath: "createdAt", order: "DESCENDING" }
]
certificates: [
  { fieldPath: "hoTenKhongDau", order: "ASCENDING" },
  { fieldPath: "createdAt", order: "DESCENDING" }
]

// classes
classes: [
  { fieldPath: "trangThai", order: "ASCENDING" },
  { fieldPath: "createdAt", order: "DESCENDING" }
]

// shipments
shipments: [
  { fieldPath: "trangThai", order: "ASCENDING" },
  { fieldPath: "sentAt", order: "DESCENDING" }
]
```

---

## 9. Quy ước đặt tên & định dạng

### 9.1 Ngày tháng
- Luôn lưu dạng chuỗi: `dd/mm/yyyy`
- Ngày: 2 chữ số (`01`–`31`)
- Tháng: `01` cho tháng 1, `2`–`12` cho tháng khác (theo PRD)
- Config option: NĐ 30/2020 (tháng 1,2 đều có số 0)

### 9.2 Số chứng chỉ
- Format: `{so}/{nam}/{loai}` (hiển thị)
- ID Firestore: `{so}-{nam}-{loai}` (lưu trữ)
- Ví dụ: `879/2026/CC` → ID: `879-2026-CC`

### 9.3 Điểm số
- Dấu phẩy thập phân: `7,5` (Việt Nam)
- Bỏ phần lẻ vô nghĩa: `7` thay vì `7,0`
- ĐTB: làm tròn 1 thập phân, kiểu Excel

### 9.4 Email
- Lowercase khi lưu và so sánh
- Dùng làm key đối soát giữa Auth và Firestore

---

## 10. Migration plan

### Giai đoạn 1: Khởi tạo
1. Tạo Firebase project
2. Bật Authentication (Email/Password hoặc Google Sign-in)
3. Deploy Firestore Rules
4. Tạo document `settings/config` với giá trị mặc định
5. Thêm admin đầu tiên qua console hoặc script

### Giai đoạn 2: Import dữ liệu cũ (nếu có)
- Script đọc data từ localStorage (nếu có)
- Upload lên Firestore theo schema mới
- Đối soát email với Auth

### Giai đoạn 3: Vận hành
- Người dùng đăng nhập bằng email nội bộ
- Admin quản lý users qua trang Cài đặt
- Mọi thao tác ghi nhật ký tự động

---

## 11. Bảo mật & Phân quyền

Xem chi tiết trong `firestore.rules`

**Tóm tắt:**
- Chỉ người có tài khoản trong collection `users` mới được truy cập
- Admin: toàn quyền
- quanLyLop: đọc tất cả, tạo/sửa lớp và chứng chỉ, không xóa được
- Nhật ký: ai cũng ghi được, chỉ admin đọc được, không sửa/xóa

---

*Tài liệu này được cập nhật lần cuối: 18/09/2026*
