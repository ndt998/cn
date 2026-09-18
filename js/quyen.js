/* =============================================================================
   js/quyen.js — danh sách người được dùng hệ thống và vai trò.

   ĐỌC KỸ TRƯỚC KHI ĐƯA LÊN REPO CÔNG KHAI
   ---------------------------------------------------------------------------
   Toàn bộ file này chạy trong trình duyệt, nên MÃ ADMIN DƯỚI ĐÂY AI XEM MÃ
   NGUỒN CŨNG ĐỌC ĐƯỢC. Nó chỉ là chốt cửa để người khác không bấm nhầm vào
   phần quản trị, KHÔNG PHẢI BẢO MẬT. Giai đoạn 1 chuyển sang Firebase Auth +
   Firestore Rules, lúc đó máy chủ của Google mới là nơi chặn thật, và mã này
   bị xóa khỏi repo. Từ giờ tới lúc đó: để repo ở chế độ private.
   ============================================================================= */
window.Quyen = (function () {
  'use strict';
  var MA_ADMIN_TAM = '159753';          // TẠM THỜI — xóa khi có Firebase Auth
  var K_ADMIN = 'quyenAdminTam', K_DS = 'danhSachNguoiDung', K_TOI = 'toiLaAi';

  function doc(khoa, macDinh) {
    try { return JSON.parse(localStorage.getItem(khoa)) ?? macDinh; }
    catch (e) { return macDinh; }
  }
  function ghi(khoa, gt) {
    try { localStorage.setItem(khoa, JSON.stringify(gt)); return true; }
    catch (e) { return false; }
  }

  /* ---- danh sách email được phép ---------------------------------------- */
  function dsNguoi() { return doc(K_DS, []); }
  function luuDS(ds) { return ghi(K_DS, ds); }
  function chuanEmail(e) { return String(e || '').trim().toLowerCase(); }
  function hopLe(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(chuanEmail(e)); }

  function them(email, ten, vaiTro) {
    email = chuanEmail(email);
    if (!hopLe(email)) return { ok: false, vi: 'Email không đúng dạng.' };
    var ds = dsNguoi();
    if (ds.some(function (n) { return n.email === email; }))
      return { ok: false, vi: 'Email này đã có trong danh sách.' };
    ds.push({ email: email, ten: String(ten || '').trim(), vaiTro: vaiTro || 'quanLyLop',
              active: true, themLuc: new Date().toISOString() });
    luuDS(ds);
    return { ok: true, nguoi: ds[ds.length - 1] };
  }
  function sua(email, thayDoi) {
    var ds = dsNguoi(), n = ds.filter(function (x) { return x.email === email; })[0];
    if (!n) return false;
    Object.keys(thayDoi).forEach(function (k) { n[k] = thayDoi[k]; });
    var r = luuDS(ds);
    apDung();
    return r;
  }
  function xoa(email) {
    return luuDS(dsNguoi().filter(function (n) { return n.email !== email; }));
  }

  /* ---- ai đang dùng máy này (giai đoạn 0: tự khai, chưa xác thực) -------- */
  function toiLa() { return doc(K_TOI, null); }
  function datToiLa(email) {
    ghi(K_TOI, email || null);
    /* đổi người thì quyền admin của phiên trước không theo sang */
    if (doc(K_ADMIN, false) === true && coAdminNaoAnToan() && !duocLamAdminAnToan(email)) {
      ghi(K_ADMIN, false);
    }
    apDung();
  }
  /* gọi được cả trước khi các hàm dưới được định nghĩa */
  function coAdminNaoAnToan() { return coAdminNao(); }
  function duocLamAdminAnToan(e) { return duocLamAdmin(e); }

  /* ---- khóa admin: PHẢI ĐỦ HAI LỚP --------------------------------------
     Lớp 1: email đang dùng phải nằm trong danh sách với vai trò admin và còn hoạt động.
     Lớp 2: nhập đúng mã quản trị.
     Đúng mã mà sai email thì vẫn không vào được — đây là yêu cầu bắt buộc, giữ
     nguyên cả sau khi nối Firebase (lúc đó lớp 1 do Firebase Auth xác thực thật,
     Firestore Rules kiểm tra vai trò ở máy chủ, mã chỉ còn là lớp thứ hai).
     Ngoại lệ duy nhất: danh sách còn rỗng thì cho vào bằng mã để lập admin đầu
     tiên — sau khi đã có một admin, ngoại lệ này tự mất. */
  function hoSoCua(email) {
    return dsNguoi().filter(function (n) { return n.email === email; })[0] || null;
  }
  function coAdminNao() {
    return dsNguoi().some(function (n) { return n.vaiTro === 'admin' && n.active !== false; });
  }
  function duocLamAdmin(email) {
    var n = hoSoCua(email);
    return !!(n && n.vaiTro === 'admin' && n.active !== false);
  }
  function laAdmin() {
    if (doc(K_ADMIN, false) !== true) return false;
    /* kiểm tra lại mỗi lần hỏi: bị hạ vai trò hay bị khóa thì mất quyền ngay,
       không cần đăng nhập lại */
    if (!coAdminNao()) return true;               // giai đoạn khởi tạo
    return duocLamAdmin(toiLa());
  }
  function moAdmin(ma) {
    var email = toiLa();
    if (coAdminNao()) {
      if (!email) return { ok: false, vi: 'Chưa chọn email của bạn ở thanh trên.' };
      if (!duocLamAdmin(email))
        return { ok: false, vi: 'Email ' + email + ' không có vai trò quản trị, hoặc đã bị khóa.' };
    }
    if (String(ma) !== MA_ADMIN_TAM) return { ok: false, vi: 'Mã quản trị không đúng.' };
    ghi(K_ADMIN, true); apDung();
    return { ok: true, khoiTao: !coAdminNao() };
  }
  function thoatAdmin() { ghi(K_ADMIN, false); apDung(); }

  /* ---- ẩn hiện phần chỉ dành cho admin ----------------------------------- */
  function apDung() {
    var ad = laAdmin();
    document.documentElement.classList.toggle('la-admin', ad);
    document.querySelectorAll('[data-chi-admin]').forEach(function (el) { el.hidden = !ad; });
  }

  /* ---- ô "bạn là ai" trên thanh trên ------------------------------------
     Giai đoạn 0 người dùng tự khai để nhật ký có tên. Giai đoạn 1 ô này thay
     bằng tài khoản Firebase đã đăng nhập, không còn tự chọn được. */
  function veOToiLa() {
    var o = document.getElementById('toiLa');
    if (!o) return;
    var ds = dsNguoi().filter(function (n) { return n.active !== false; });
    var hienTai = toiLa();
    o.innerHTML = '<option value="">— chưa khai tên —</option>' +
      ds.map(function (n) {
        return '<option value="' + n.email + '">' + (n.ten ? n.ten + ' · ' : '') + n.email +
               (n.vaiTro === 'admin' ? ' (admin)' : '') + '</option>';
      }).join('');
    if (hienTai && !ds.some(function (n) { return n.email === hienTai; })) { datToiLa(null); hienTai = null; }
    o.value = hienTai || '';
    o.classList.toggle('chua', !hienTai);
    o.title = ds.length ? 'Nhật ký ghi tên này' : 'Chưa có email nào trong danh sách — thêm ở trang Cài đặt';
    o.onchange = function () {
      datToiLa(o.value || null);
      o.classList.toggle('chua', !o.value);
    };
  }

  document.addEventListener('DOMContentLoaded', function () { apDung(); veOToiLa(); });

  return {
    dsNguoi: dsNguoi, them: them, sua: sua, xoa: xoa, hopLe: hopLe, chuanEmail: chuanEmail,
    toiLa: toiLa, datToiLa: datToiLa,
    laAdmin: laAdmin, moAdmin: moAdmin, thoatAdmin: thoatAdmin, apDung: apDung,
    coAdminNao: coAdminNao, duocLamAdmin: duocLamAdmin, hoSoCua: hoSoCua,
    veOToiLa: veOToiLa,
    /* xuất đúng dạng để dán vào Firestore ở giai đoạn 1 */
    xuatFirestore: function () {
      var o = {};
      dsNguoi().forEach(function (n) {
        o[n.email] = { email: n.email, ten: n.ten, vaiTro: n.vaiTro, active: n.active };
      });
      return JSON.stringify({ users: o }, null, 2);
    }
  };
})();
