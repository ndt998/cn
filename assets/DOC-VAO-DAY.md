# Thư mục assets

File `logo.png` hiện là logo tạm do hệ thống vẽ. **Ghi đè nó bằng logo thật của Trường**,
giữ nguyên tên:

    assets/logo.png

Giao diện tự nhận ra và thay dấu hiệu vẽ sẵn ở góc trên thanh bên. Không có file
thì vẫn chạy bình thường, không lỗi, không phải sửa mã.

- Nên dùng PNG nền trong suốt, vuông, cạnh 128–512 px.
- Đường dẫn là đường dẫn tương đối nên chạy đúng cả khi mở bằng file:// lẫn khi
  đưa lên GitHub Pages, kể cả khi trang nằm trong thư mục con của tài khoản.
- **Không** đặt logo lên phôi chứng chỉ: phôi in sẵn đã có Quốc huy và logo rồi,
  in đè lên là hỏng.

Muốn đổi tên file hoặc dùng SVG thì sửa một chỗ duy nhất: thẻ `<img src="assets/logo.png">`
trong khối thanh bên của mỗi trang HTML.
