# Ghi chú Hợp nhất File HTML - Merge 1

## Thời điểm thực hiện
- **Ngày**: 2026-01-XX
- **Lý do**: Quá nhiều file HTML rời gây lỗi, đặc biệt là vấn đề login

## Vấn đề gặp phải

### 1. Lỗi Login nghiêm trọng
**File gốc**: `login.html`
- Lỗi cú pháp JavaScript: đoạn code bị lặp từ dòng 317-335
- Hàm `checkUserPermission` và xử lý form submit bị duplicate
- Firebase Auth không hoạt động đúng cách

**Nguyên nhân**:
```javascript
// Dòng 317-335 bị lặp lại toàn bộ khối catch error
} catch (error) {
    console.error('Lỗi đăng nhập:', error);
    // ... code bị lặp
}
});
// Code lặp bắt đầu từ đây
if (error.code === 'auth/invalid-email') {
```

### 2. Cấu trúc dự án phân mảnh
**13 file HTML riêng biệt**:
1. `index.html` - Bảng điều khiển
2. `login.html` - Đăng nhập (BỊ LỖI)
3. `lop-hoc.html` - Quản lý lớp học
4. `chung-chi.html` - In chứng chỉ
5. `chung-nhan.html` - Chứng nhận (placeholder)
6. `bang-diem.html` - Bảng điểm A5
7. `chung-chi-bang-diem.html` - Kết hợp (placeholder)
8. `tem-thu.html` - Tem thư chuyển phát
9. `tra-cuu.html` - Tra cứu (placeholder)
10. `cai-dat.html` - Cài đặt hệ thống
11. `nhat-ky.html` - Nhật ký hoạt động (admin only)

**Vấn đề**:
- Mỗi file đều load riêng: `auth-guard.js`, `vo.js`, `quyen.js`, `nhat-ky.js`
- CSS được load nhiều lần từ CDN Tabler
- Firebase config được import ở nhiều nơi
- Routing giữa các trang gây mất state

## Giải pháp thực hiện

### File hợp nhất: `app.html` ✅ ĐÃ TẠO
**Cấu trúc mới**: Single Page Application (SPA) đơn giản

```
app.html
├── Head
│   ├── Meta tags
│   ├── CSS (Tabler CDN + app.css + print CSS)
│   └── Firebase config (inline)
├── Body
│   ├── Login Section (ẩn/hiện dựa trên auth state)
│   └── Main App Section
│       ├── Sidebar Navigation
│       ├── Top Header
│       └── Content Pages (tất cả trong 1 file)
│           ├── Dashboard (index)
│           ├── LopHoc
│           ├── ChungChi
│           ├── BangDiem
│           ├── TemThu
│           ├── CaiDat
│           └── NhatKy (admin only)
└── Scripts
    ├── Firebase SDK imports
    ├── Auth logic (sửa lỗi login)
    ├── Navigation routing
    └── Page-specific logic
```

### Sửa lỗi Login
**Code đúng**:
```javascript
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const permissionCheck = await checkUserPermission(userCredential.user.uid);
        
        if (!permissionCheck.allowed) {
            await signOut(auth);
            throw new Error(permissionCheck.message);
        }
        
        window.location.replace('index.html');
    } catch (error) {
        // Xử lý error MỘT LẦN duy nhất
        showError(error.message);
    }
});
```

## Các file JS giữ nguyên
- `js/vo.js` - UI sidebar toggle
- `js/quyen.js` - Quản lý quyền (giai đoạn 0)
- `js/nhat-ky.js` - Logging hoạt động
- `js/format.js` - Format ngày tháng, số liệu
- `js/nhap-excel.js` - Đọc Excel với SheetJS
- `js/auth-guard.js` - **CẦN SỬA** để phù hợp SPA
- `js/spec.js` - Spec cho bảng điểm
- `firebase-config.js` - **NÊN INLINE** vào app.html

## CSS Files
- `css/app.css` - Giữ nguyên
- `css/print-chung-chi.css` - Print styles cho chứng chỉ
- `css/print-bang-diem.css` - Print styles cho bảng điểm
- `css/print-tem.css` - Print styles cho tem thư

## Lưu ý quan trọng

### 1. Firebase Configuration
```javascript
// GIỮ NGUYÊN CẤU HÌNH NHƯNG CẨN THẬN VỚI API KEY
const firebaseConfig = {
  apiKey: "AIzaSyB3lDKv3UZ52u0vNDR3tMUQMhsZ1HMDGL0",
  authDomain: "cnprd-e5d92.firebaseapp.com",
  projectId: "cnprd-e5d92",
  storageBucket: "cnprd-e5d92.firebasestorage.app",
  messagingSenderId: "664579171182",
  appId: "1:664579171182:web:ea8fd70c51f1dca12d977f",
  measurementId: "G-GCPYD6FG6"
};
```

### 2. Authentication Flow (SỬA)
```
User chưa login → Hiển thị Login Form
User login thành công → Kiểm tra Firestore users collection
  ├─ User exists & active → Hiển thị Main App
  └─ User không tồn tại hoặc inactive → Logout + Error

User đã login → Tự động chuyển đến Dashboard
```

### 3. Routing trong SPA
Thay vì chuyển trang thật (`window.location.href = 'chung-chi.html'`), dùng:
```javascript
function showPage(pageId) {
    document.querySelectorAll('.content-page').forEach(p => p.hidden = true);
    document.getElementById(pageId).hidden = false;
    // Cập nhật sidebar active state
    // Cập nhật URL hash nếu cần (#chung-chi)
}
```

## Giai đoạn tiếp theo

### Merge 2 (nếu cần)
- [ ] Tách CSS inline thành file riêng nếu quá dài
- [ ] Tối ưu lazy loading cho các module JS
- [ ] Thêm service worker cho offline support
- [ ] Implement proper state management

### Giai đoạn 1 (Firebase Integration)
- [ ] Di chuyển authentication sang Firebase Auth hoàn toàn
- [ ] Firestore schema cho:
  - `users` collection
  - `classes` collection  
  - `students` subcollection
  - `certificates` collection
  - `activity_logs` collection
- [ ] Firestore Rules cho security
- [ ] Xóa `js/quyen.js` (thời kỳ đồ đá)

## Checklist sau khi merge
- [ ] Test login flow với tài khoản hợp lệ
- [ ] Test login flow với tài khoản không tồn tại
- [ ] Test login flow với tài khoản inactive
- [ ] Test navigation giữa các trang
- [ ] Test in chứng chỉ
- [ ] Test in bảng điểm
- [ ] Test upload Excel
- [ ] Test admin features (nhật ký, cài đặt)
- [ ] Test responsive mobile
- [ ] Test print layouts

---

## Cập nhật: File app.html đã tạo thành công

**Ngày**: 2026-01-XX
**File**: `/workspace/app.html`
**Kích thước**: ~1500 dòng code

### Tính năng đã implement:

#### 1. Login System ✅
- Form đăng nhập email/password
- Firebase Authentication tích hợp
- Kiểm tra quyền user trong Firestore collection `users`
- Xử lý lỗi chi tiết (invalid-email, user-not-found, wrong-password, too-many-requests)
- Support returnUrl parameter
- Clean URL sau login (ẩn thông tin nhạy cảm)
- Auto-redirect nếu đã login

#### 2. SPA Navigation ✅
- Hash-based routing (#index, #lop-hoc, #chung-chi, etc.)
- Sidebar navigation với active state
- Browser back/forward support
- URL bookmarking

#### 3. Pages đã tạo placeholder:
- Dashboard (index) - Full UI với progress bars, recent classes table
- Lop Hoc - Upload Excel section
- Chung Chi - Preview + print controls
- Chung Nhan - Placeholder
- Bang Diem - Placeholder
- Chung Chi Bang Diem - Placeholder
- Tem Thu - Placeholder
- Tra Cuu - Placeholder
- Cai Dat - Placeholder
- Nhat Ky - Placeholder (admin only)

#### 4. Logout ✅
- Sign out Firebase Auth
- Clear localStorage
- Return to login page

#### 5. Responsive Design ✅
- Mobile-friendly sidebar (slide-in)
- Flexible grid system
- Touch-friendly buttons

### Lỗi đã sửa từ login.html gốc:
- ❌ **XÓA** duplicate code block (dòng 317-335)
- ❌ **XÓA** redundant error handling
- ✅ **GIỮ** single clean try-catch block
- ✅ **GIỮ** proper error message mapping

### Cách sử dụng:
1. Mở `app.html` trong browser
2. Đăng nhập với email/password có quyền trong Firestore
3. Navigate qua sidebar menu
4. Sử dụng các tính năng như bình thường

### Next Steps:
- Populate nội dung thật cho các trang con từ file HTML gốc
- Implement Excel upload functionality
- Implement certificate preview & printing
- Connect Firestore data
- Add activity logging
