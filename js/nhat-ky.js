/* =============================================================================
   js/nhat-ky.js — ghi vết hoạt động.

   Giai đoạn 0 lưu trong localStorage của từng máy (tối đa 1000 dòng gần nhất).
   Giai đoạn 1 mỗi dòng thành một document trong collection `nhat_ky` của
   Firestore, kèm uid người thực hiện; Rules cho mọi người TẠO nhưng chỉ admin
   ĐỌC, nên người dùng không thể xóa dấu vết của mình. Cấu trúc dòng giữ nguyên
   để chuyển sang không phải sửa chỗ gọi.
   ============================================================================= */
window.NhatKy = (function () {
  'use strict';
  var KHOA = 'nhatKyHoatDong', TRAN = 1000;

  var LOAI = {
    napFile:    'Nạp file Excel',
    dungLop:    'Chọn lớp làm việc',
    in:         'In',
    capSo:      'Cấp số',
    doiCaiDat:  'Đổi cài đặt',
    themNguoi:  'Thêm người dùng',
    suaNguoi:   'Sửa người dùng',
    xoaNguoi:   'Xóa người dùng',
    moAdmin:    'Vào chế độ quản trị',
    thoatAdmin: 'Thoát chế độ quản trị',
    xoaNhatKy:  'Xóa nhật ký'
  };

  function doc() {
    try { return JSON.parse(localStorage.getItem(KHOA)) || []; }
    catch (e) { return []; }
  }
  function luu(ds) {
    try { localStorage.setItem(KHOA, JSON.stringify(ds.slice(-TRAN))); return true; }
    catch (e) { return false; }
  }

  function ghi(loai, chiTiet, soLuong) {
    var ds = doc();
    ds.push({
      luc: new Date().toISOString(),
      ai: (window.Quyen && window.Quyen.toiLa()) || 'chưa khai',
      admin: !!(window.Quyen && window.Quyen.laAdmin()),
      loai: loai,
      chiTiet: String(chiTiet || ''),
      soLuong: soLuong == null ? null : Number(soLuong),
      trang: location.pathname.split('/').pop() || 'index.html'
    });
    luu(ds);
    return ds[ds.length - 1];
  }

  function gioVN(iso) {
    var d = new Date(iso);
    var hai = function (n) { return String(n).padStart(2, '0'); };
    return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear() +
           ' ' + hai(d.getHours()) + ':' + hai(d.getMinutes()) + ':' + hai(d.getSeconds());
  }

  function xuatCSV() {
    var cot = ['Thời điểm', 'Người thực hiện', 'Quản trị', 'Hoạt động', 'Chi tiết', 'Số lượng', 'Trang'];
    var hang = doc().map(function (d) {
      return [gioVN(d.luc), d.ai, d.admin ? 'có' : '', LOAI[d.loai] || d.loai,
              d.chiTiet, d.soLuong == null ? '' : d.soLuong, d.trang];
    });
    var thoat = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    return '\ufeff' + [cot].concat(hang).map(function (r) { return r.map(thoat).join(','); }).join('\r\n');
  }

  return { ghi: ghi, doc: doc, LOAI: LOAI, gioVN: gioVN, xuatCSV: xuatCSV,
           xoa: function () { var n = doc().length; luu([]); ghi('xoaNhatKy', 'xóa ' + n + ' dòng'); } };
})();
