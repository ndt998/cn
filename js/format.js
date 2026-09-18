/* =============================================================================
   js/format.js — quy tắc định dạng dùng chung cho HTML, DOCX và XLSX.
   Một nguồn sự thật. Mọi chỗ in ra ngày, điểm, số hiệu đều gọi qua đây.
   Đã có bộ kiểm thử: 01/01, 05/3, 19/12, round1(7.85)=7.9, fmtScore(7)='7'.
   ============================================================================= */
window.FMT = (function () {
  'use strict';

  /* Mặc định theo Nghị định 30/2020/NĐ-CP về thể thức văn bản hành chính:
     ngày < 10 và tháng 1, 2 phải thêm số 0. Đổi được ở trang Cài đặt. */
  var settings = { quyTacThang: 'nd30' };     // 'nd30' (mặc định) | 'prd'
  try {
    var luu = localStorage.getItem('quyTacThang');
    if (luu === 'prd' || luu === 'nd30') settings.quyTacThang = luu;
  } catch (e) {}

  function fmtDay(d) { return String(Number(d)).padStart(2, '0'); }
  function fmtMonth(m) {
    m = Number(m);
    return settings.quyTacThang === 'nd30'
      ? (m <= 2 ? String(m).padStart(2, '0') : String(m))
      : (m === 1 ? '01' : String(m));
  }
  var fmtDateSlash = function (d, m, y) { return fmtDay(d) + '/' + fmtMonth(m) + '/' + y; };
  var fmtDateWords = function (d, m, y) {
    return 'ngày ' + fmtDay(d) + ' tháng ' + fmtMonth(m) + ' năm ' + y;
  };

  var round1 = function (x) { return Math.round(x * 10 + 1e-9) / 10; };
  var fmtScore = function (x) { return String(round1(x)).replace('.', ','); };
  function dtb(diem, heSo) {
    var t = 0, h = 0;
    for (var i = 0; i < diem.length; i++) { t += diem[i] * heSo[i]; h += heSo[i]; }
    return round1(t / h);
  }
  function xepLoai(v, ng) {
    ng = ng || { gioi: 9, kha: 7, tb: 5 };
    return v >= ng.gioi ? 'Giỏi' : v >= ng.kha ? 'Khá' : v >= ng.tb ? 'Trung bình' : 'Không xếp loại';
  }
  var CHU = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
  function scoreWords(x) {
    var v = round1(x), n = Math.floor(v + 1e-9), l = Math.round((v - n) * 10);
    var s = CHU[n] + (l ? ' phẩy ' + CHU[l] : '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function normText(s) {
    return String(s == null ? '' : s).normalize('NFC').replace(/\s+/g, ' ').trim();
  }
  /* bỏ dấu + hoa hết, chỉ dùng để SO KHỚP tên cột, không bao giờ để in ra */
  function khongDau(s) {
    return normText(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
  }

  /* Ngày luôn đọc từ CHUỖI dd/mm/yyyy. Không bao giờ tự đọc ô kiểu Date. */
  function parseDate(s) {
    var m = /^\s*(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{4})\s*$/.exec(String(s == null ? '' : s));
    if (!m) return null;
    var d = +m[1], mo = +m[2], y = +m[3];
    if (mo < 1 || mo > 12 || d < 1) return null;
    var t = new Date(y, mo - 1, d);
    if (t.getDate() !== d || t.getMonth() !== mo - 1) return null;
    return { d: d, m: mo, y: y };
  }
  function words(s) { var p = parseDate(s); return p ? fmtDateWords(p.d, p.m, p.y) : null; }
  function namCua(s) { var p = parseDate(s); return p ? p.y : new Date().getFullYear(); }

  /* Số hiệu: nhận "879" hoặc "879/2026/CC"; hậu tố CC = chứng chỉ, GCN = chứng nhận */
  function soDayDu(so, nam, hauTo) {
    var t = normText(so);
    var m = /^(\d+)\s*\/\s*(\d{4})\s*\/\s*([A-Za-z]+)$/.exec(t);
    if (m) return m[1] + '/' + m[2] + '/' + m[3].toUpperCase();
    return (t.replace(/\D/g, '') || '—') + '/' + nam + '/' + hauTo;
  }
  /* Đoán loại văn bản từ chính số hiệu: có GCN là chứng nhận, có CC là chứng chỉ */
  function loaiTuSo(so) {
    var t = khongDau(so);
    if (/GCN/.test(t)) return 'CN';
    if (/CC/.test(t)) return 'CC';
    return null;
  }
  var hauToCua = function (loai) { return loai === 'CN' ? 'GCN' : 'CC'; };

  return {
    settings: settings,
    fmtDay: fmtDay, fmtMonth: fmtMonth, fmtDateSlash: fmtDateSlash, fmtDateWords: fmtDateWords,
    round1: round1, fmtScore: fmtScore, dtb: dtb, xepLoai: xepLoai, scoreWords: scoreWords,
    normText: normText, khongDau: khongDau,
    parseDate: parseDate, words: words, namCua: namCua,
    soDayDu: soDayDu, loaiTuSo: loaiTuSo, hauToCua: hauToCua
  };
})();
