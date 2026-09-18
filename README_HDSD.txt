================================================================================
  HE THONG CAP CHUNG CHI HANG LOAT  -  HUONG DAN SU DUNG VA BAN GIAO
  Truong Chinh sach cong va Phat trien nong thon
  Cap nhat: 18/09/2026
================================================================================

Tai lieu nay viet cho nguoi lan dau tiep nhan san pham, ke ca ban chua tung lam
web. Doc tu tren xuong, lam theo tung buoc.

MUC LUC
  1. San pham nay la gi
  2. May can co gi truoc khi dung
  3. Chay thu ngay tren may minh
  4. Dung hang ngay: cac buoc lam viec
  5. Dua len GitHub de moi nguoi cung dung
  6. Cai Firebase (giai doan 2 - luu du lieu that)
  7. Phan quyen: ai duoc vao, ai la quan tri
  8. Thay logo cua Truong
  9. Nhung dieu tuyet doi khong lam
 10. Su co thuong gap va cach xu ly
 11. Ban giao cho nguoi tiep theo


================================================================================
1. SAN PHAM NAY LA GI
================================================================================

Mot trang web tinh (khong co may chu, khong co cai dat gi phuc tap) giup Phong
Dao tao:

  - Nap file Excel danh sach lop hoc vien
  - Kiem tra du lieu truoc khi in (sai ngay sinh, trung so, thieu so...)
  - In chung chi / chung nhan de len phoi in san kho 19 x 13,5 cm
  - In nhan dan bi thu chuyen phat
  - Ghi nhat ky: ai lam gi, luc nao

"Web tinh" nghia la toan bo chi gom cac file .html, .css, .js. Khong can cai
may chu, khong can cai phan mem. Chep vao dau cung chay duoc.


================================================================================
2. MAY CAN CO GI TRUOC KHI DUNG
================================================================================

  [1] Trinh duyet Google Chrome (hoac Microsoft Edge). KHONG dung Firefox de in
      vi Firefox xu ly kho giay tuy chinh khac di.

  [2] Font Times New Roman. May Windows co cai Microsoft Office la co san.
      He thong tu kiem tra, thieu font thi bao do va chan khong cho in.

  [3] May in da khai bao kho giay tuy chinh 190 x 135 mm trong driver.
      Cach khai (Windows 10/11):
        Settings > Bluetooth & devices > Printers & scanners
        > chon may in > Printer properties > Custom paper sizes / Server
          Properties > tao kho moi ten "Phoi chung chi" 190mm x 135mm

  [4] Ket noi mang lan dau. He thong tai thu vien giao dien tu Internet.
      Sau do trinh duyet nho lai nen lan sau chay duoc ca khi mang cham.


================================================================================
3. CHAY THU NGAY TREN MAY MINH
================================================================================

  Cach 1 - nhanh nhat, khong can gi ca:
    Giai nen thu muc, nhay dup vao file  index.html
    Trinh duyet mo len la chay.

  Cach 2 - khi da noi Firebase (xem muc 6):
    Bat buoc phai chay qua dia chi http, vi dang nhap Firebase khong lam viec
    voi file mo truc tiep. Mo Command Prompt tai thu muc nay roi go:

        python -m http.server 8080

    Sau do mo trinh duyet vao:  http://localhost:8080
    (May chua co Python thi tai tai python.org, khi cai nho tich "Add to PATH")

  In thu lan dau:
    Vao trang "Chung chi" > tich o "In khung can chinh" > bam In > in ra giay
    trang > soi to giay do len phoi that de xem lech bao nhieu mm > nhap so
    lech dx, dy o o "Can chinh may in" > bam "Luu cho may nay".
    Lam mot lan cho moi may in, lan sau khong phai lam lai.

  Trong hop thoai in cua Chrome nho dat:
    - Destination: may in that (hoac Save as PDF de xem truoc)
    - Paper size: kho tuy chinh 190 x 135 mm da khai o muc 2
    - Margins: None          - Scale: 100 (KHONG de Fit to page)
    - Bo tich "Headers and footers"


================================================================================
4. DUNG HANG NGAY: CAC BUOC LAM VIEC
================================================================================

  BUOC 1 - Chuan bi file Excel
    File danh sach lop, moi hoc vien mot dong. Cac cot he thong hieu duoc:

      GCN hoac SCC       so hieu. Ten cot "GCN" thi he thong hieu la CHUNG NHAN,
                         ten cot "SCC" thi hieu la CHUNG CHI
      HT                 ho va ten
      NS                 ngay sinh, viet dang chu  dd/mm/yyyy
      DAY, MONTH, YEAR   ngay, thang, nam tach rieng  <= CACH AN TOAN NHAT
      CT                 don vi cong tac
      DIA CHI            dia chi nhan thu (thuong o cot H)
      SDT                so dien thoai

    Khong bat buoc dat dung ten nhu tren. He thong tu doan, doan sai thi sua tay.

    *** QUAN TRONG VE NGAY SINH ***
    O ngay sinh nen la dang CHU, khong phai dang ngay thang cua Excel.
    Cach lam: boi den cot ngay sinh > chuot phai > Format Cells > chon Text >
    nhap lai. Neu de Excel hieu la ngay thang, khong the biet chac 7/4 la ngay 7
    thang 4 hay ngay 4 thang 7, va he thong se bao do bat xac nhan tung o.
    Tot nhat la them ba cot DAY, MONTH, YEAR nhu file danh sach GCN dang lam.

  BUOC 2 - Nap file
    Bam nut xanh "Nap Excel" o thanh tren (co o moi trang).
    Trang Lop hoc hien ra ba buoc: chon file > doi chieu cot > soat du lieu.
    Xem ky phan mau do (loi) va mau vang (can xem lai).
    Xong thi bam "Dung danh sach nay".

  BUOC 3 - In chung chi
    Sang trang "Chung chi". Danh sach hien ra ben phai.
    Tich chon nhung nguoi can in > xem truoc ben trai > bam In.
    Kiem tra lai: ten nguoi ky phai nam tren mot dong, chu khong tran ra ngoai.

  BUOC 4 - In nhan dan bi thu
    Sang trang "Tem thu" > nap chinh file do (file phai co cot dia chi).
    Nhan chi in bon dong: nguoi nhan, dia chi, so dien thoai, don vi.
    Chinh so cot, so hang, kich thuoc cho khop giay tem dang dung roi bam In nhan.


================================================================================
5. DUA LEN GITHUB DE MOI NGUOI CUNG DUNG
================================================================================

GitHub Pages cho phep dua web tinh len mang mien phi. Lam theo tung buoc:

  BUOC 1 - Tao tai khoan
    Vao  github.com  > Sign up > dang ky bang email co quan.

  BUOC 2 - Tao kho chua ma nguon (repository)
    Goc tren ben phai bam dau + > New repository
      Repository name:  he-thong-chung-chi
      Chon:  Private     <= QUAN TRONG, xem canh bao ben duoi
      Bam:   Create repository

    *** VI SAO PHAI CHON PRIVATE ***
    Ma quan tri nam trong file js/quyen.js va ai xem ma nguon cung doc duoc.
    Khi nao da noi Firebase xong (muc 6) va da xoa ma tam thi moi chuyen sang
    Public duoc. Truoc do de Public la ai cung vao duoc phan quan tri.

  BUOC 3 - Tai file len
    Trong trang repository vua tao, bam "uploading an existing file".
    Keo THA TOAN BO noi dung ben trong thu muc he-thong-chung-chi vao o do.
    Luu y: keo cac file BEN TRONG thu muc (index.html, css, js, assets...),
    khong keo ca thu muc cha, neu khong dia chi web se bi lech mot cap.
    Keo xong bam "Commit changes".

  BUOC 4 - Bat GitHub Pages
    Trong repository > tab Settings > menu ben trai chon Pages
      Source:  Deploy from a branch
      Branch:  main   /  (root)
      Bam Save.
    Cho khoang 1-2 phut, tai lai trang. GitHub se hien dia chi dang:

        https://<ten-tai-khoan>.github.io/he-thong-chung-chi/

    Do la dia chi gui cho moi nguoi dung.
    (Repository Private thi GitHub Pages can tai khoan tra phi. Neu dung ban
     mien phi thi phai de Public - khi do BAT BUOC phai lam xong muc 6 va xoa
     ma quan tri tam truoc da.)

  BUOC 5 - Sua file ve sau
    Vao repository > bam vao file can sua > bieu tuong cay but > sua >
    Commit changes. Trang web tu cap nhat sau 1-2 phut.
    Muon thay nhieu file thi dung lai buoc 3, GitHub se hoi co ghi de khong.


================================================================================
6. CAI FIREBASE (GIAI DOAN 2 - LUU DU LIEU THAT)
================================================================================

Hien tai du lieu chi nam trong trinh duyet cua tung may. Noi Firebase de:
  - Dang nhap bang email that
  - Luu chung chi da cap, tra cuu duoc, khong the cap trung so
  - Nhat ky khong ai xoa duoc

*** LUU Y: phan ma nguon noi Firebase CHUA DUOC VIET. Thu muc nay da co san
file firestore.rules va cau truc du lieu; nguoi lam tiep chi can viet
js/firebase.js va js/db.js. Cac buoc duoi la phan chuan bi tai khoan. ***

  BUOC 1 - Tao du an
    Vao  console.firebase.google.com  > Add project
    Dat ten, vi du "chung-chi-cscptnt". Google Analytics chon tat cung duoc.

  BUOC 2 - Bat dang nhap
    Menu trai > Build > Authentication > Get started
    Tab "Sign-in method" > chon Google > Enable > Save.
    (Neu Truong dung email co quan khong phai Gmail thi chon "Email/Password")

  BUOC 3 - Tao co so du lieu
    Menu trai > Build > Firestore Database > Create database
    Chon "Start in production mode" (KHONG chon test mode).
    Location: chon asia-southeast1 (Singapore) cho gan Viet Nam.

  BUOC 4 - Dan quy tac phan quyen
    Trong Firestore Database > tab Rules
    Xoa het noi dung cu, mo file  firestore.rules  trong thu muc nay,
    chep toan bo noi dung dan vao, bam Publish.
    Day moi la cho chan that su: chay tren may chu Google, nguoi dung khong
    sua duoc.

  BUOC 5 - Lay thong tin ket noi
    Bieu tuong banh rang > Project settings > keo xuong muc "Your apps"
    Bam bieu tuong </> (Web) > dat ten app > Register app.
    Google hien ra mot doan nhu sau, CHEP LAI GIU KY:

        const firebaseConfig = {
          apiKey: "AIza...",
          authDomain: "chung-chi-cscptnt.firebaseapp.com",
          projectId: "chung-chi-cscptnt",
          storageBucket: "...",
          messagingSenderId: "...",
          appId: "..."
        };

    Doan nay CONG KHAI duoc, khong phai mat khau. Cai bao ve that la Rules o
    buoc 4. Nguoi lam tiep se dat doan nay vao file js/firebase.js.

  BUOC 6 - Cho phep dia chi web
    Authentication > tab Settings > Authorized domains > Add domain
    Them:  <ten-tai-khoan>.github.io
    Khong them thi dang nhap se bao loi "unauthorized domain".

  BUOC 7 - Tao nguoi dung dau tien
    Vao Firestore > Start collection > ten collection:  users
    Them mot document, Document ID la UID cua ban (lay o tab Authentication
    sau khi dang nhap lan dau), voi cac truong:

        email    (string)   email cua ban
        ten      (string)   ho ten
        vaiTro   (string)   admin
        active   (boolean)  true

    Tu day tro di them nguoi khac lam ngay tren trang Cai dat cua he thong.

  Chi phi: goi Spark mien phi cho 50.000 luot doc va 20.000 luot ghi moi ngay.
  Mot lop 80 hoc vien dung het chua toi 500 luot. Khong can the tin dung.
  KHONG bat Cloud Storage vi phan do doi goi tra phi.


================================================================================
7. PHAN QUYEN: AI DUOC VAO, AI LA QUAN TRI
================================================================================

Hai vai tro:

  Quan ly lop  - dung duoc moi trang nghiep vu: nap Excel, in chung chi, in tem.
                 Khong xem duoc nhat ky, khong sua duoc danh sach nguoi dung.

  Quan tri     - them them: danh sach email duoc phep, nhat ky hoat dong,
                 cai dat toan he thong.

VAO CHE DO QUAN TRI CAN DU HAI THU, THIEU MOT LA KHONG VAO DUOC:

    (1) Email cua ban phai co trong danh sach voi vai tro quan tri
    (2) Nhap dung ma quan tri

Dung ma ma sai email thi van khong vao duoc. Doi sang email khac thi quyen mat
ngay. Bi ha vai tro trong luc dang mo cung mat ngay.

Cach vao lan dau (khi danh sach con rong):
    Trang Cai dat > nhap ma > vao duoc ngay (che do khoi tao)
    > them chinh email cua ban voi vai tro "Quan tri"
    > tu luc nay bat buoc phai chon email o thanh tren truoc khi nhap ma.

He thong khong cho ha vai tro hoac xoa NGUOI QUAN TRI CUOI CUNG, de tranh
truong hop khoa chet khong ai vao duoc.

DOI MA QUAN TRI:
    Mo file  js/quyen.js  bang Notepad
    Tim dong:   var MA_ADMIN_TAM = '159753';
    Doi so trong dau nhay thanh ma moi > luu lai > tai file len GitHub.

    *** Ma nay chi de ngan bam nham, KHONG phai bao mat. Ai xem ma nguon
    trang web cung doc duoc. Vi vay repository phai de Private cho toi khi
    noi xong Firebase. ***


================================================================================
8. THAY LOGO CUA TRUONG
================================================================================

Chep file logo cua Truong de len file  assets/logo.png  (giu nguyen ten).
Giao dien tu nhan ra, khong phai sua ma.
  - Nen dung PNG nen trong suot, hinh vuong, canh 128 den 512 pixel.
  - KHONG dat logo len phoi chung chi: phoi in san da co Quoc huy va logo roi,
    in de len la hong ca to phoi.


================================================================================
9. NHUNG DIEU TUYET DOI KHONG LAM
================================================================================

  - Khong sua cac con so trong  css/print-chung-chi.css  va  js/spec.js
    neu chua do lai. Do la so do da doi chieu voi phoi that, sai lech 0,01 mm.
    Sua xong bat buoc in ra PDF do lai truoc khi cho in hang loat.

  - Khong dua danh sach hoc vien vao GitHub. Repository chi chua ma nguon.
    Du lieu hoc vien chi nam trong Firestore.

  - Khong tron chung chi (19 x 13,5) va bang diem (A5) vao cung mot lenh in.
    Hai kho giay, hai khay giay, phai in hai lan theo cung thu tu.

  - Khong dat logo, khung, Quoc huy len to chung chi.

  - Khong doi thu vien SheetJS sang ban tren npm hay jsDelivr: ban do cu va co
    hai loi bao mat, lai khong doc duoc file .xls doi cu.

  - Khong tu "chuan hoa" ho ten hoc vien (viet hoa chu cai dau). Ten rieng co
    ngoai le, sua may la sai ten nguoi ta tren chung chi.


================================================================================
10. SU CO THUONG GAP VA CACH XU LY
================================================================================

  Bao "May nay khong co Times New Roman"
    > Cai Microsoft Office, hoac cai rieng font Times New Roman, roi tai lai trang.

  In ra thua mot to giay trang
    > Trong hop thoai in dat Margins = None va Scale = 100.
      Van bi thi kiem tra kho giay trong driver co dung 190 x 135 mm khong.

  Chu in lech so voi phoi
    > Trang Chung chi > tich "In khung can chinh" > in ra giay trang > soi len
      phoi > do do lech > nhap vao o dx, dy > "Luu cho may nay".

  Nap Excel bao "30 o ngay sinh la kieu Date"
    > Mo file Excel, boi den cot ngay sinh, Format Cells > Text, nhap lai dang
      dd/mm/yyyy. Hoac them ba cot DAY, MONTH, YEAR. Dung bo qua canh bao nay:
      no chinh la loi in sai ngay sinh len phoi.

  Nap Excel bao "khong co cot so hieu"
    > Dung. File bang diem lop von khong co so chung chi. Dung file danh sach
      lam chung chi (co cot GCN hoac SCC) de in.

  He thong bao "DTB trong file la 8,1 tinh lai duoc 8,0"
    > Hai nguon du lieu lech nhau. Phai kiem tra lai bang diem goc da ky, KHONG
      duoc bo qua. He thong co y khong tu sua de nguoi lam biet ma doi chieu.

  Bam "Nap Excel" khong thay gi
    > Kiem tra mang. Thu vien doc Excel tai tu Internet lan dau.

  Mo bang file:// thi trang Cai dat khong nho duoc danh sach email
    > Do trinh duyet chan luu tru voi file mo truc tiep. Chay qua
      python -m http.server 8080 nhu muc 3.


================================================================================
11. BAN GIAO CHO NGUOI TIEP THEO
================================================================================

Nguoi lam tiep phan ky thuat doc file  note_bangdiem.md  trong cung thu muc.
File do co: toan bo so do ky thuat, quy tac dinh dang, cac bay du lieu da gap,
nhat ky quyet dinh va danh sach viec con lai.

Thu tu viec con lai theo de xuat:
    1. Trang Bang diem A5 (can file mau Bang diem KHO A5.docx de doi chieu)
    2. Noi Firebase (Auth + Firestore + bat firestore.rules)
    3. Xuat DOCX lam duong in du phong
    4. Xuat XLSX bang diem lop
    5. Trang tra cuu va in lai co ghi vet

Bay cau hoi con cho chu du an chot nam o muc 13 cua file note_bangdiem.md.

================================================================================
