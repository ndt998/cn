/* =============================================================================
   js/vo.js — việc chung của khung vỏ. Nạp trong <head>, không defer, để trạng
   thái thu gọn áp trước khi vẽ (tránh giật một nhịp).
   ============================================================================= */
(function () {
  'use strict';
  var KHOA = 'thanhBenThuGon';

  try {
    if (localStorage.getItem(KHOA) === '1') document.documentElement.classList.add('gon');
  } catch (e) { /* trình duyệt chặn localStorage thì cứ mở rộng */ }

  document.addEventListener('DOMContentLoaded', function () {
    var nut = document.querySelector('.nut-gon');
    if (!nut) return;
    capNhat();
    nut.addEventListener('click', function () {
      var gon = document.documentElement.classList.toggle('gon');
      try { localStorage.setItem(KHOA, gon ? '1' : '0'); } catch (e) {}
      capNhat();
      window.dispatchEvent(new Event('resize'));   // để bản xem trước tính lại bề rộng
    });
    function capNhat() {
      var gon = document.documentElement.classList.contains('gon');
      nut.setAttribute('aria-expanded', gon ? 'false' : 'true');
      nut.title = gon ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên';
      nut.setAttribute('aria-label', nut.title);
      document.querySelectorAll('.canh a.mi').forEach(function (a) {
        a.title = gon ? a.textContent.trim() : '';
      });
    }
  });

  /* Lớp đang làm việc dùng chung giữa các trang. Giai đoạn 0 giữ tạm trong
     sessionStorage; giai đoạn 1 thay bằng Firestore. */
  window.LopTam = {
    khoa: 'lopDangLamViec',
    luu: function (lop) {
      try { sessionStorage.setItem(this.khoa, JSON.stringify(lop)); return true; }
      catch (e) { return false; }
    },
    doc: function () {
      try { return JSON.parse(sessionStorage.getItem(this.khoa) || 'null'); }
      catch (e) { return null; }
    },
    xoa: function () { try { sessionStorage.removeItem(this.khoa); } catch (e) {} }
  };
})();
