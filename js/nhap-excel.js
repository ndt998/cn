/* =============================================================================
   js/nhap-excel.js — đọc file danh sách lớp bằng SheetJS.
   Viết theo đúng ba file thật của Phòng Đào tạo:
     · danh sách làm GCN.xls   → GCN | HT | NS | DAY | MONTH | YEAR | CT, tiêu đề dòng 1
     · bảng điểm lớp K27.xls   → tiêu đề nằm ở dòng 4, có chân trang chữ ký phải bỏ
     · bảng điểm nạp chứng chỉ → Stt | SCC | Họ và tên | Ngày/tháng/năm sinh | …
   Nên không ép người dùng sửa file: tự dò dòng tiêu đề, tự khớp tên cột, cho
   sửa tay nếu dò sai.
   ============================================================================= */
window.NhapExcel = (function () {
  'use strict';
  var F = window.FMT;

  /* ---- bí danh tên cột. So khớp sau khi bỏ dấu và viết hoa ----------------
     "HỌ VÀ TẾN" (lỗi gõ trong file thật) và "HỌ VÀ TÊN" đều thành HO VA TEN. */
  var BI_DANH = {
    so:      ['GCN', 'SCC', 'SO CC', 'SO CC/CN', 'SO CHUNG CHI', 'SO', 'SO HIEU', 'SO GCN'],
    hoTen:   ['HT', 'HO VA TEN', 'HO TEN', 'HO VA TEN HV', 'HOC VIEN'],
    ngaySinh:['NS', 'NGAY SINH', 'NGAY/THANG/ NAM SINH', 'NGAY THANG NAM SINH', 'NAM SINH',
              'NGAY/THANG/NAM SINH'],
    ngay:    ['DAY', 'NGAY'],
    thang:   ['MONTH', 'THANG'],
    nam:     ['YEAR', 'NAM'],
    donVi:   ['CT', 'DVCT', 'DON VI CONG TAC', 'DON VI', 'CO QUAN CONG TAC', 'CO QUAN'],
    stt:     ['STT', 'TT'],
    diaChi:  ['DIA CHI', 'DC', 'DIA CHI NHAN', 'DIA CHI NHAN THU', 'ADDRESS', 'NOI NHAN'],
    sdt:     ['SDT', 'DT', 'DIEN THOAI', 'SO DIEN THOAI', 'PHONE', 'TEL'],
    nguoiNhan:['NGUOI NHAN', 'NGUOI NHAN THAY', 'NN'],
    dtb:     ['DIEM TRUNG BINH', 'TRUNG BINH', 'DTB'],
    xepLoai: ['XEP LOAI']
  };
  /* cột điểm: nhận dạng theo mẫu chứ không liệt kê hết */
  function laCotDiem(h) {
    return /^DIEM MON \d/.test(h) || /^KIEM TRA LAN \d/.test(h) ||
           /^DIEM TIEU LUAN$/.test(h) || /^TIEU LUAN$/.test(h) || /^DIEM /.test(h);
  }
  function doanTruong(header) {
    var h = F.khongDau(header);
    if (!h) return '';
    for (var k in BI_DANH) if (BI_DANH[k].indexOf(h) >= 0) return k;
    if (laCotDiem(h)) return 'diem';
    return '';
  }

  var TEN_TRUONG = {
    so: 'Số hiệu', hoTen: 'Họ và tên', ngaySinh: 'Ngày sinh (chuỗi)',
    ngay: 'Ngày', thang: 'Tháng', nam: 'Năm', donVi: 'Đơn vị công tác',
    stt: 'STT', diem: 'Cột điểm', dtb: 'ĐTB có sẵn', xepLoai: 'Xếp loại có sẵn',
    diaChi: 'Địa chỉ nhận thư', sdt: 'Số điện thoại', nguoiNhan: 'Người nhận thay',
    '': '(bỏ qua)'
  };

  /* ---- đọc file ---------------------------------------------------------- */
  function docFile(file) {
    return new Promise(function (ok, loi) {
      if (typeof XLSX === 'undefined') { loi(new Error('Chưa nạp được thư viện đọc Excel. Kiểm tra kết nối mạng rồi tải lại trang.')); return; }
      var fr = new FileReader();
      fr.onerror = function () { loi(new Error('Không đọc được file.')); };
      fr.onload = function (e) {
        try {
          var wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array', cellDates: true });
          ok({
            ten: file.name,
            co: file.size,
            wb: wb,
            sheets: wb.SheetNames.map(function (n) {
              var ws = wb.Sheets[n];
              return {
                ten: n,
                tho:  XLSX.utils.sheet_to_json(ws, { header: 1, raw: true,  defval: null, blankrows: true }),
                chu:  XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null, blankrows: true })
              };
            })
          });
        } catch (er) { loi(new Error('File không mở được: ' + er.message)); }
      };
      fr.readAsArrayBuffer(file);
    });
  }

  /* ---- dò dòng tiêu đề: dòng nào khớp được nhiều tên cột nhất trong 15 dòng đầu -- */
  function doDongTieuDe(aoa) {
    var tot = 0, chon = 0;
    for (var i = 0; i < Math.min(15, aoa.length); i++) {
      var r = aoa[i] || [], d = 0;
      for (var j = 0; j < r.length; j++) if (doanTruong(r[j])) d++;
      if (d > tot) { tot = d; chon = i; }
    }
    return { dong: chon, khop: tot };
  }

  /* ---- khớp cột --------------------------------------------------------- */
  function khopCot(header) {
    return header.map(function (h, i) {
      return { chiSo: i, ten: F.normText(h), truong: doanTruong(h) };
    });
  }

  /* ---- lấy dữ liệu ------------------------------------------------------ */
  function layDong(sheet, dongTieuDe, cot) {
    var lay = function (r, truong) {
      var c = cot.filter(function (x) { return x.truong === truong; })[0];
      return c ? r[c.chiSo] : null;
    };
    var cotDiem = cot.filter(function (x) { return x.truong === 'diem'; });
    var coCotSo = cot.some(function (x) { return x.truong === 'so'; });
    var ra = [], trong = 0;
    for (var i = dongTieuDe + 1; i < sheet.tho.length; i++) {
      var rt = sheet.tho[i] || [], rc = sheet.chu[i] || [];
      var hoTen = F.normText(lay(rc, 'hoTen'));
      if (!hoTen) { if (++trong >= 3) break; continue; }
      /* chân trang chữ ký: không có số, không có đơn vị, không có ngày */
      var coSo = lay(rc, 'so'), coDV = F.normText(lay(rc, 'donVi'));
      var coNgay = lay(rc, 'ngaySinh') || lay(rt, 'ngay');
      if (!coSo && !coDV && !coNgay) { if (++trong >= 3) break; continue; }
      trong = 0;

      var hv = {
        stt: F.normText(lay(rc, 'stt')),
        so: F.normText(coSo),
        hoTen: hoTen,
        donVi: coDV,
        diaChi: F.normText(lay(rc, 'diaChi')),
        sdt: F.normText(lay(rc, 'sdt')),
        nguoiNhan: F.normText(lay(rc, 'nguoiNhan')),
        diem: {},
        canhBao: [],
        loi: []
      };

      /* --- ngày sinh: ưu tiên ba cột tách sẵn, đó là cách an toàn nhất --- */
      var d = lay(rt, 'ngay'), m = lay(rt, 'thang'), y = lay(rt, 'nam');
      if (d && m && y) {
        hv.ngaySinh = F.fmtDay(d) + '/' + String(Number(m)).padStart(2, '0') + '/' + y;
        hv.nguonNgay = 'ba cột ngày/tháng/năm';
      } else {
        var oTho = lay(rt, 'ngaySinh'), oChu = F.normText(lay(rc, 'ngaySinh'));
        if (oTho instanceof Date) {
          /* Ô kiểu Date: không tự đoán. Đưa cả hai cách đọc để người dùng chọn. */
          var dd = oTho.getDate(), mm = oTho.getMonth() + 1, yy = oTho.getFullYear();
          hv.ngaySinh = F.fmtDay(dd) + '/' + String(mm).padStart(2, '0') + '/' + yy;
          hv.nguonNgay = 'ô kiểu Date';
          hv.ngayKhac = (mm <= 31 && mm >= 1 && dd <= 12)
            ? F.fmtDay(mm) + '/' + String(dd).padStart(2, '0') + '/' + yy : null;
          hv.loi.push('ngày sinh là ô kiểu Date, phải xác nhận' +
            (hv.ngayKhac ? ' — có thể là ' + hv.ngaySinh + ' hoặc ' + hv.ngayKhac : ''));
        } else if (F.parseDate(oChu)) {
          var p = F.parseDate(oChu);
          hv.ngaySinh = F.fmtDay(p.d) + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
          hv.nguonNgay = 'chuỗi trong file';
        } else {
          hv.ngaySinh = '';
          hv.loi.push('không đọc được ngày sinh' + (oChu ? ' từ "' + oChu + '"' : ''));
        }
      }

      /* --- điểm --- */
      cotDiem.forEach(function (c) {
        var v = rt[c.chiSo];
        if (v === null || v === undefined || v === '') return;
        var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
        if (isNaN(n)) { hv.canhBao.push('điểm "' + c.ten + '" không phải số'); return; }
        if (n < 0 || n > 10) hv.loi.push('điểm "' + c.ten + '" ngoài khoảng 0–10');
        hv.diem[c.ten] = n;
      });

      var sanDTB = lay(rt, 'dtb'), sanXL = F.normText(lay(rc, 'xepLoai'));
      if (sanDTB != null && sanDTB !== '') hv.dtbSan = typeof sanDTB === 'number'
        ? sanDTB : parseFloat(String(sanDTB).replace(',', '.'));
      if (sanXL) hv.xepLoaiSan = sanXL;

      if (coCotSo && !hv.so) hv.loi.push('thiếu số hiệu');
      if (/\s{2,}|^\s|\s$/.test(String(lay(rc, 'hoTen') || ''))) hv.canhBao.push('họ tên có khoảng trắng thừa, đã dọn');
      ra.push(hv);
    }
    return ra;
  }

  /* ---- soát toàn danh sách ---------------------------------------------- */
  function soat(ds, tenCotSo) {
    var dem = {}, trung = {};
    ds.forEach(function (h) {
      if (!h.so) return;
      var k = h.so.replace(/\D/g, '');
      dem[k] = (dem[k] || 0) + 1;
      if (dem[k] > 1) trung[k] = true;
    });
    ds.forEach(function (h) {
      if (h.so && trung[h.so.replace(/\D/g, '')]) h.loi.push('số hiệu trùng trong file');
    });
    /* loại văn bản đoán từ giá trị số hiệu, nếu không có thì từ chính tên cột:
       cột tên "GCN" là chứng nhận, cột "SCC" là chứng chỉ */
    var loai = null;
    for (var i = 0; i < ds.length && !loai; i++) loai = F.loaiTuSo(ds[i].so);
    if (!loai && tenCotSo) loai = F.loaiTuSo(tenCotSo);
    return {
      khongCoCotSo: !ds.some(function (h) { return h.so; }),
      soCoDiaChi: ds.filter(function (h) { return h.diaChi; }).length,
      soHV: ds.length,
      soLoi: ds.filter(function (h) { return h.loi.length; }).length,
      soCanhBao: ds.filter(function (h) { return h.canhBao.length && !h.loi.length; }).length,
      loaiDoan: loai,
      khoangSo: ds.length ? (function () {
        var n = ds.map(function (h) { return parseInt(h.so.replace(/\D/g, ''), 10); })
                 .filter(function (x) { return !isNaN(x); });
        return n.length ? Math.min.apply(null, n) + ' – ' + Math.max.apply(null, n) : '';
      })() : ''
    };
  }

  return {
    docFile: docFile, doDongTieuDe: doDongTieuDe, khopCot: khopCot,
    layDong: layDong, soat: soat, TEN_TRUONG: TEN_TRUONG, doanTruong: doanTruong
  };
})();
