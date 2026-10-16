# Lời thương · Thiệp 20/10

Website thiệp chúc mừng bằng HTML, CSS, JavaScript thuần. Tạo lời chúc theo quan hệ, chọn một trong 12 không gian, nghe thử nhạc và gửi liên kết giữ nguyên tấm thiệp. Không cần backend, tài khoản, thư viện từ CDN hoặc bước build. Font tiếng Việt nằm trong dự án.

## Chạy và triển khai

Trong thư mục dự án:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Dùng trình duyệt trên máy chạy lệnh để mở cổng 8000. Có thể dùng Live Server. Cần phục vụ qua HTTP/HTTPS để kiểm tra tệp nhạc; `file://` không hỗ trợ đầy đủ. Khi gửi thiệp cho người khác, tạo liên kết từ địa chỉ website đã triển khai, không dùng địa chỉ máy cá nhân.

GitHub Pages: trong **Settings → Pages**, chọn **Deploy from a branch → main → /(root)**. Merge Pull Request từ `codex/20-10-premium` vào `main`, rồi chờ tác vụ Pages hoàn tất. Khi tải thủ công, phải đưa lên cả `index.html` và thư mục `assets/`; các module mới không còn nằm hết trong HTML. Giữ các MP3 cũ tại thư mục gốc.

## Tạo một món quà riêng

1. Chọn mẹ, bà, cô giáo, chị gái, em gái, bạn nữ, nhóm phụ nữ hoặc người thương. Mỗi quan hệ có ít nhất 6 lời gợi ý; sắc thái gồm ngắn gọn, ấm áp, vui vẻ, xúc động, thêm ngọt ngào và lãng mạn cho người thương.
2. Chọn cặp xưng hô hoặc sửa cả cách xưng và cách gọi. Khi đổi quan hệ, cặp xưng hô và lời mẫu cập nhật cùng nhau. Lời tự viết được giữ kèm lựa chọn **Giữ lời tôi viết / Dùng mẫu mới**.
3. Tên người gửi mặc định trống. Nếu không có tên, toàn bộ chữ ký được ẩn. Không lưu bản nháp vào bộ nhớ trình duyệt và không tự điền tên chủ dự án.
4. Chọn chủ đề có hình thu nhỏ. **Phối giúp tôi** chuyển giữa các tổ hợp được chọn theo người nhận; **Phối sẵn theo chủ đề** phục hồi phối cảnh mà vẫn giữ nội dung.
5. Chỉnh chi tiết, chọn nhạc rồi xem thử. Người nhận chạm nút hoặc vật thể chính để mở; thao tác đó kích hoạt nhạc nếu bài có tệp và trình duyệt cho phép. Có nút bỏ qua và xem lại.

Lời tự viết tối đa 3.000 đơn vị UTF-16, lời nhắn riêng và lời nhắn phụ tối đa 1.000; bộ đếm và giới hạn dùng cùng cách đếm với ô nhập HTML. Tên tối đa 100, cách xưng/cách gọi 30. Nội dung nhập được chuẩn hóa Unicode NFC và hiển thị bằng `textContent`.

## 12 chủ đề

| Chủ đề | Không gian và cảnh mở | Tương tác |
| --- | --- | --- |
| Vũ trụ ngân hà | Tinh vân, hành tinh có vành, bụi sao hội tụ | Nối một chòm sao |
| Cực quang | Dải sáng ngọc và tím hé mở giữa trời đêm | Dải sáng theo con trỏ ở màn mở; hạt sáng khi chạm |
| Khu vườn xanh | Lá mở hai bên, hoa xanh và đom đóm | Nở thêm cụm hoa |
| Vườn hồng | Hoa hồng nhiều lớp, nụ hoa bung mở | Cánh hoa xoay bay |
| Nắng trong vườn | Cúc vàng, ô cửa và rèm mở đón nắng | Đốm nắng tỏa ra |
| Sen thanh nhã | Cánh sen hé trên mặt nước ngọc | Gợn nước lan |
| Hồ trăng | Trăng bạc, hồ xanh đêm và thư trên nước | Đốm sáng, vòng nước |
| Bướm và hoa | Pastel, hoa mềm, bướm vỗ cánh bay đi | Thả cánh bướm |
| Thư tay kỷ niệm | Giấy có vân, dấu sáp và phong thư | Chạm dấu sáp đọc lời nhắn |
| Ngọc trai | Lụa, ánh xà cừ, các lớp thiệp tách ra | Ánh ngọc lan nhẹ |
| Trái tim pha lê | Mặt cắt pha lê hồng tím hé lời chúc | Tim nhỏ tỏa sáng |
| Dải ngân hà tình yêu | Hai quỹ đạo gặp nhau, tim từ các vì sao | Gửi vệt sao thương |

Gợi ý mặc định: mẹ — nắng; bà — sen; cô giáo — thư tay; chị/em — bướm; bạn nữ — vườn xanh; nhóm phụ nữ — ngọc trai; người thương — ngân hà tình yêu. Tất cả người nhận đều có thể chọn mọi chủ đề. Đổi hình ảnh không đổi quan hệ, lời nhắn hoặc nhóm nhạc.

Chi tiết độc lập: 6 bảng màu; 4 nét chữ (Lora, Manrope, Lora nghiêng, Dancing Script); 3 cỡ chữ; 4 dáng (thư tay, thiệp đứng, toàn cảnh, thiệp gập); bố cục trái/giữa; kiểu mở tương thích; hiệu ứng nhẹ/vừa/nổi bật/tắt; hiện lời ngay/nhẹ/chậm; ngày 20.10 và chữ ký bật/tắt; lời đề tặng; nút **Một điều muốn nói**.

Cảnh mở kéo dài khoảng 2–2,8 giây. Hiệu ứng sau khi đọc chạy chậm, có giới hạn; tương tác đặc biệt chỉ ở vùng trang trí và không chiếm thao tác cuộn. Chuyển động dừng khi ẩn tab, giảm mật độ theo thiết bị và tuân thủ `prefers-reduced-motion`. Không dùng canvas hoặc vòng `requestAnimationFrame` liên tục. Đồ họa SVG/CSS tự tạo, không lấy emoji phóng lớn làm tranh chính.

## Nhạc: 6 nhóm, 6 vị trí

Đặt tệp mới trong **`assets/music/`**:

| Nhóm | Tên tệp từ 0 đến 5 |
| --- | --- |
| Mẹ | `0me.mp3`, `1me.mp3`, `2me.mp3`, `3me.mp3`, `4me.mp3`, `5me.mp3` |
| Bà | `0ba.mp3`, `1ba.mp3`, `2ba.mp3`, `3ba.mp3`, `4ba.mp3`, `5ba.mp3` |
| Cô giáo | `0co.mp3`, `1co.mp3`, `2co.mp3`, `3co.mp3`, `4co.mp3`, `5co.mp3` |
| Chị/em gái | `0chi.mp3`, `1chi.mp3`, `2chi.mp3`, `3chi.mp3`, `4chi.mp3`, `5chi.mp3` |
| Bạn nữ/nhóm phụ nữ | `0nu.mp3`, `1nu.mp3`, `2nu.mp3`, `3nu.mp3`, `4nu.mp3`, `5nu.mp3` |
| Người thương | `0yeu.mp3`, `1yeu.mp3`, `2yeu.mp3`, `3yeu.mp3`, `4yeu.mp3`, `5yeu.mp3` |

Hiện chưa có **36 tệp mang tên chuẩn** này. Bốn vị trí vẫn nghe được bằng tệp cũ: `me:0` → `nhac_me.mp3`, `ba:0` → `nhac_ba.mp3`, `nu:0` → `music_under.mp3`, `nu:1` → `music_over.mp3`. Chưa đổi tên hay sao chép bài. **32 vị trí chưa có bản thu**: `1–5me`, `1–5ba`, `0–5co`, `0–5chi`, `2–5nu`, `0–5yeu` (đều đuôi `.mp3`).

Xem [MUSIC.md](MUSIC.md) để có danh sách thiếu, bảng chuyển tên và gợi ý nhạc theo từng nhóm. Tên bài/nghệ sĩ trong `assets/music/catalog.json` chỉ nên điền sau khi xác định đúng bản thu. Các hướng chọn nhạc là gợi ý, không phải tên nội dung của tệp hiện có.

Chỉ có một phần tử audio. Trình phát kiểm tra HEAD cho nhóm được chọn, tải metadata của bài được chọn, không tải trước 36 bài. Có nghe thử, phát/dừng, trước/sau, âm lượng và kiểm tra lại tệp. Không tự phát khi bắt đầu nhập liệu; thiếu nhạc không ngăn mở thiệp. Lựa chọn tắt nhạc được giữ khi xem lại. Nếu hệ điều hành không cho điều chỉnh âm lượng qua web, dùng nút âm lượng điện thoại.

## Liên kết giữ đúng tấm thiệp

Định dạng mới `#c=` nén dữ liệu v4, lưu nguyên văn lời chúc đã render, cặp xưng hô, người nhận/gửi, lời nhắn, mọi lựa chọn thiết kế, nhạc và âm lượng. Thay đổi danh sách mẫu sau này không làm lời chúc đã gửi đổi theo. Không tạo mã ngắn qua dịch vụ bên ngoài; độ dài vẫn phụ thuộc nội dung.

Đọc được liên kết `#card=` v1/v2 và `#c=` packed v3 của các bản trước. Dữ liệu lời cũ được giữ riêng; nhạc cũ `women:0` được chuyển sang vị trí tương ứng `women:1`. Tên đã có trong dữ liệu thiệp cũ vẫn được tôn trọng. Người dùng mới luôn bắt đầu với ô tên trống.

Giới hạn kích thước cả trước và trong giải nén; kiểm tra phiên bản, kiểu dữ liệu, lựa chọn, khóa nguy hiểm và độ sâu JSON. Sao chép chỉ báo thành công khi API thành công; có ô sao chép thủ công. Liên kết chứa nội dung tấm thiệp: bất kỳ ai có liên kết đều đọc được, kể cả lời nhắn mở bằng nút riêng.

## Các tệp cấu hình

| Tệp | Vai trò |
| --- | --- |
| `index.html` | Cấu trúc trang, CSS nền và các cảnh cũ còn dùng cho liên kết trước đây |
| `assets/js/app.js` | Trạng thái, giao diện, cặp xưng hô, chia sẻ và kiểm tra dữ liệu |
| `assets/js/greetings.js` | 54 lời chúc, sắc thái, cặp xưng hô, các trường template rõ ràng |
| `assets/js/legacy-greetings.js` | Nguyên văn 24 lời chúc của liên kết cũ |
| `assets/js/themes.js` | Danh mục 12 chủ đề, SVG, cảnh mở, tương tác và vòng đời hiệu ứng |
| `assets/css/themes.css`, `assets/css/collection.css` | Không gian, chất liệu, chi tiết và bố cục điện thoại |
| `assets/js/card-music.js` | Tìm tệp và trình phát duy nhất |
| `assets/music/catalog.json` | 36 mục ID, đường dẫn, tên hiển thị, nghệ sĩ và gợi ý |
| `assets/js/card-links.js` | Bộ nén LZ và schema v4, đọc dữ liệu cũ; kèm giấy phép MIT |
| `assets/fonts/` | Font tự lưu và giấy phép OFL |

## Kiểm thử

Cần Python, Playwright và Chromium. Website không cần các công cụ này để chạy. Sau khi khởi động HTTP server:

```bash
BASE_URL=http://127.0.0.1:8000/ python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Bốn bộ kiểm thử gồm luồng tạo/gửi, Unicode và nội dung an toàn, nhạc thật qua HTTP, lỗi phát/clipboard, dữ liệu cũ, 12 cảnh mở bằng bàn phím, hiệu ứng tắt/giảm chuyển động, chia sẻ đầy đủ và thiệp dài ở 360/390 px, tablet, desktop, xoay ngang. MP3 fixture dùng byte của các bản thu hiện có; không giả việc giải mã/phát thành công. Kiểm thử trường hợp trình duyệt chặn nhạc chủ động mô phỏng lỗi từ API.

Kết quả ngày 16/10/2026: đã chạy 75 kiểm thử; 74 ca đạt sau khi sửa lỗi phát lại lúc trở về editor và chạy lại 5 ca âm thanh liên quan, 1 ca bỏ qua do chính sách môi trường. Kiểm tra cú pháp toàn bộ module JavaScript, ID/nhãn HTML và đường dẫn tài nguyên cũng đạt. Kiểm tra bằng Chromium với viewport mô phỏng, chưa xác minh trên iPhone/Safari hay Android thật. Một trường hợp `file://` bị chính sách Chromium của môi trường chặn trước khi chạy ứng dụng. GitHub Pages chỉ cập nhật sau khi PR được merge và tác vụ triển khai thành công.
