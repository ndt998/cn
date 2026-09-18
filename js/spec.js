/* =============================================================================
   js/spec.js — mọi số đo của tờ chứng chỉ. Nguồn: brainstorm.md mục 3.
   Đã đối chiếu bằng phép đo tự động, sai số ≤ 0,01 mm. Đơn vị mm, trừ nơi ghi pt.
   Dùng chung cho HTML in và DOCX sinh bằng docx.js — một nguồn sự thật.
   ============================================================================= */
window.SPEC = {
  trang:   { rong: 190, cao: 135 },
  le:      { tren: 9.5, phai: 10, duoi: 2.5, trai: 7.5 },
  vung:    { rong: 172.5, cao: 123 },
  tam:     { bo: 42.5, truong: 40, quocHieu: 132.5, chucDanhTren: 132.5,
             ngayKy: 135, so: 40, tenKy: 135 },
  noiDung: { thutTrai: 90, rong: 82.5 },
  kyGap:   23,
  co:      { nen: 11, noiDung: 12 },
  nen:     { bo: -0.7, truong: -1.2 },
  nenToiDa: 1.2
};
