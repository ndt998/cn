# Authentication Flow — Chỉ dành cho người nội bộ

## Tổng quan

Hệ thống sử dụng **Firebase Authentication** kết hợp với **Firestore Security Rules** để đảm bảo chỉ người nội bộ mới có thể truy cập dữ liệu. Không cho phép đăng ký tự do — admin phải thêm email vào danh sách trước.

---

## 1. Nguyên tắc bảo mật

### 1.1. Chỉ người nội bộ
- **Không có nút "Đăng ký"** trên giao diện
- Admin phải thêm email người dùng vào Firestore collection `users` TRƯỚC khi họ đăng nhập
- Email phải khớp chính xác (case-insensitive) giữa Auth và Firestore

### 1.2. Hai lớp bảo vệ
1. **Lớp 1 — Firebase Auth:** Xác thực danh tính (email + password)
2. **Lớp 2 — Firestore Rules:** Kiểm tra vai trò trong collection `users`

> Người có tài khoản Auth nhưng KHÔNG có record trong `users` → không đọc/ghi được gì

### 1.3. Vai trò
- **admin:** Toàn quyền (thêm/sửa/xóa user, xóa lớp, đọc nhật ký)
- **quanLyLop:** Đọc tất cả, tạo/sửa lớp và chứng chỉ, KHÔNG xóa được

---

## 2. Luồng đăng nhập

```
┌─────────────────────────────────────────────────────────────────┐
│                        NGƯỜI DÙNG                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Nhập email & mật khẩu (Firebase Login Form)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Firebase Auth xác thực                                       │
│    - Thành công: trả về userCredential.user.uid                │
│    - Thất bại: báo lỗi (sai mật khẩu, không tồn tại)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Client kiểm tra Firestore: users/{uid}                      │
│    - Đọc document của chính mình                                │
│    - Lấy thông tin: email, ten, vaiTro, active                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
          ┌───────────────┐   ┌───────────────────┐
          │ Có record     │   │ Không có record   │
          │ active=true   │   │ hoặc active=false │
          └───────────────┘   └───────────────────┘
                    │                   │
                    ▼                   ▼
          ┌───────────────┐   ┌───────────────────┐
          │ ĐĂNG NHẬP     │   │ BÁO LỖI:          │
          │ THÀNH CÔNG    │   │ "Bạn chưa được    │
          │               │   │  cấp quyền truy   │
          │ - Lưu info    │   │  cập. Liên hệ     │
          │ - Hiển thị UI │   │  admin."          │
          │ - Cho phép    │   │ - Đăng xuất ngay  │
          │   thao tác    │   │                   │
          └───────────────┘   └───────────────────┘
```

---

## 3. Các bước triển khai

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới (hoặc chọn project có sẵn)
3. Ghi lại **Project ID** và **Web App Configuration**

### Bước 2: Bật Authentication

1. Vào **Authentication** → **Sign-in method**
2. Chọn **Email/Password** → Enable
3. (Tùy chọn) Thêm **Google Sign-in** nếu muốn
4. **KHÔNG bật** "Email link" hay "Phone auth" (không cần thiết)

### Bước 3: Authorized Domains

1. Vào **Authentication** → **Settings** → **Authorized domains**
2. Thêm domain GitHub Pages: `your-username.github.io`
3. Thêm domain localhost để dev: `localhost`

### Bước 4: Cấu hình Firestore

1. Tạo Firestore database (chế độ production)
2. Deploy file `firestore.rules` đã cập nhật
3. Tạo document đầu tiên: `users/{admin-uid}` với thông tin admin

### Bước 5: Thêm admin đầu tiên

**Cách 1: Qua Firebase Console (nhanh nhất)**

```javascript
// Vào Firestore Console, tạo document:
Collection: users
Document ID: {uid-của-admin-từ-Auth}
Fields:
  - email: "admin@truongchinh sach.gov.vn" (string)
  - ten: "Nguyễn Văn A" (string)
  - vaiTro: "admin" (string)
  - active: true (boolean)
  - createdAt: {timestamp}
  - createdBy: "system" (string)
```

**Cách 2: Tạo script import**

```javascript
// scripts/init-admin.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = { /* dán config từ Firebase Console */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function initAdmin(email, password, ten) {
  // Đăng nhập tạm để lấy uid
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  
  // Tạo record trong users
  await setDoc(doc(db, 'users', uid), {
    email: email.toLowerCase(),
    ten: ten,
    vaiTro: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  });
  
  console.log('Admin created with UID:', uid);
}

// Chạy: node scripts/init-admin.js
```

---

## 4. Giao diện đăng nhập (dự kiến)

### 4.1. Trang login (`login.html`)

```html
<!-- Đơn giản, không có nút đăng ký -->
<form id="loginForm">
  <input type="email" id="email" placeholder="email@noibo.gov.vn" required>
  <input type="password" id="password" placeholder="Mật khẩu" required>
  <button type="submit">Đăng nhập</button>
</form>
<div id="errorMessage" hidden></div>
```

### 4.2. Xử lý đăng nhập (`js/auth.js` — sẽ tạo)

```javascript
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export async function dangNhap(email, password) {
  try {
    // Bước 1: Firebase Auth
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    
    // Bước 2: Kiểm tra Firestore
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await signOut(auth);
      throw new Error('Bạn chưa được cấp quyền truy cập. Liên hệ admin.');
    }
    
    const userData = userSnap.data();
    if (!userData.active) {
      await signOut(auth);
      throw new Error('Tài khoản này đã bị khóa.');
    }
    
    // Thành công
    return {
      ok: true,
      uid: uid,
      email: userData.email,
      ten: userData.ten,
      vaiTro: userData.vaiTro
    };
    
  } catch (error) {
    return { ok: false, vi: error.message };
  }
}

export function dangXuat() {
  return signOut(auth);
}

export function nguoiDungHienTai() {
  return auth.currentUser;
}
```

---

## 5. Quản lý người dùng (trang Cài đặt)

### 5.1. Chức năng admin

| Hành động | Mô tả |
|-----------|-------|
| **Thêm người dùng** | Nhập email, tên, vai trò → tạo record trong `users` |
| **Sửa vai trò** | Đổi giữa `admin` và `quanLyLop` |
| **Khóa/Mở khóa** | Toggle trường `active` |
| **Xóa người dùng** | Xóa record khỏi `users` (không xóa Auth account) |

### 5.2. Sample form thêm user

```html
<form id="themUserForm" data-chi-admin>
  <input type="email" id="newEmail" placeholder="email@noibo.gov.vn" required>
  <input type="text" id="newTen" placeholder="Họ và tên" required>
  <select id="newVaiTro">
    <option value="quanLyLop">Quản lý lớp</option>
    <option value="admin">Admin</option>
  </select>
  <button type="submit">Thêm</button>
</form>
```

---

## 6. Security Checklist

- [ ] Firebase project đã tạo
- [ ] Authentication enabled (Email/Password)
- [ ] Authorized domains đã cấu hình
- [ ] Firestore rules đã deploy
- [ ] Admin đầu tiên đã được tạo
- [ ] Không có nút "Đăng ký" trên giao diện
- [ ] Email validation (chỉ email nội bộ)
- [ ] Logging đầy đủ (nhật ký đăng nhập)

---

## 7. Lưu ý quan trọng

### 7.1. Bảo mật API Keys
- API Key Firebase **công khai là bình thường**
- Bảo mật thật sự nằm ở **Firestore Rules**
- Không lưu secret nào trong client code

### 7.2. Quên mật khẩu
- Dùng Firebase "Forgot password" feature
- Gửi email reset qua Firebase Auth
- Admin không can thiệp được mật khẩu

### 7.3. Tài khoản bị khóa
- Admin set `active: false` trong Firestore
- User vẫn đăng nhập Auth được, nhưng không đọc/ghi được gì
- Firestore Rules chặn ở server

### 7.4. Xóa người dùng
- Xóa record trong `users` → mất quyền truy cập
- Auth account vẫn tồn tại (có thể xóa riêng trong Auth Console)
- Dữ liệu do user tạo vẫn còn (không bị xóa theo)

---

## 8. Test cases

| Scenario | Kết quả mong đợi |
|----------|------------------|
| Đăng nhập bằng email chưa có trong `users` | Lỗi: "Bạn chưa được cấp quyền" |
| Đăng nhập bằng email bị khóa (`active=false`) | Lỗi: "Tài khoản đã bị khóa" |
| Admin thêm user mới → user đăng nhập | Thành công |
| User cố đọc `/users/{uid-khac}` (không phải admin) | Firestore Rules chặn |
| User cố xóa lớp | Firestore Rules chặn (chỉ admin xóa được) |
| User ghi nhật ký | Thành công, nhưng chỉ admin đọc được |

---

*Tài liệu này được cập nhật lần cuối: 18/09/2026*
