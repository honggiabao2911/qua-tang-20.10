# Gửi người phụ nữ tôi yêu thương

Website tạo và gửi thiệp chúc mừng Ngày Phụ nữ Việt Nam bằng HTML, CSS và JavaScript thuần. Toàn bộ giao diện, phong bì 3D và nội dung nằm trong `index.html`; không cần backend, cài thư viện hay bước build.

## Chạy trên máy

Từ thư mục dự án, chạy:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở <http://127.0.0.1:8000> trong trình duyệt. Dừng máy chủ bằng `Ctrl+C`.

Bạn cũng có thể mở thư mục trong VS Code hoặc PyCharm rồi mở `index.html` bằng trình duyệt. Nếu dùng VS Code với Live Server hoặc máy chủ xem trước của PyCharm, hãy dùng địa chỉ HTTP mà công cụ cung cấp. Mở tệp trực tiếp bằng `file://` vẫn xem và thử thiệp được, nhưng chức năng tạo liên kết chia sẻ sẽ không khả dụng; hãy chạy máy chủ HTTP để dùng tính năng này.

## Tạo và gửi thiệp

1. Chọn nhóm người nhận phù hợp, bao gồm các biến thể dành cho chị/em và tập thể khi có.
2. Chọn một trong các mẫu lời chúc, nhập tên người nhận, tên người gửi và cách xưng hô. Tên người gửi mặc định là **Hồng Gia Bảo**.
3. Thêm lời nhắn riêng, tối đa 1.000 ký tự, rồi xem trước và mở phong bì.
4. Tạo liên kết, sao chép và gửi cho người nhận. Người mở liên kết sẽ vào chế độ nhận thiệp với nội dung bạn đã chọn.

Giao diện hỗ trợ điện thoại, thao tác bàn phím và tùy chọn giảm chuyển động của hệ điều hành (`prefers-reduced-motion`).

## Liên kết chia sẻ và quyền riêng tư

Nội dung thiệp được lưu trong dữ liệu JSON có phiên bản, mã hóa biểu diễn vào phần sau dấu `#` của URL. Đây **không phải mã hóa bảo mật**: bất kỳ ai có liên kết đều có thể đọc tên và lời chúc. Không đưa thông tin nhạy cảm vào thiệp.

Website không cần máy chủ lưu thiệp. Phần fragment sau dấu `#` không được gửi trong yêu cầu HTTP tải trang thông thường, nhưng toàn bộ liên kết vẫn có thể xuất hiện trong lịch sử trình duyệt, ứng dụng nhắn tin hoặc nơi bạn dán liên kết. Dịch vụ rút gọn liên kết và một số ứng dụng có thể giới hạn độ dài hoặc làm mất fragment; hãy thử mở liên kết sau khi gửi. Lời chúc ngắn giúp đường dẫn dễ chia sẻ hơn.

## Tùy chỉnh

Mở `index.html` và tìm các phần sau:

| Vị trí | Nội dung có thể đổi |
| --- | --- |
| `CONFIG` ở đầu JavaScript | `siteName`, `defaultSender`, `musicSrc`, `maxMessageLength` và `effects` |
| `GREETINGS` | 24 mẫu lời chúc; giữ các biến `{self}` và `{you}` |
| `RECIPIENTS` | Nhóm người nhận, biến thể và cách xưng hô mặc định |
| CSS `:root` | Bảng màu, kiểu chữ và các biến giao diện |

Giữ cấu trúc dữ liệu và các khóa được mã nguồn sử dụng khi sửa mẫu lời chúc. Nếu thay đổi giới hạn ký tự, hãy kiểm tra lại độ dài liên kết chia sẻ trên các ứng dụng bạn dùng.

## Nhạc nền tùy chọn

Mặc định dự án chưa kèm `assets/music.mp3`; giao diện hiển thị **“Chưa có nhạc nền”**. Các bài MP3 cũ ở thư mục gốc được giữ lại, nhưng không tự sử dụng làm nhạc nền vì chưa xác nhận chúng là nhạc không lời phù hợp.

Để thêm nhạc, tạo thư mục `assets` và đặt một tệp nhạc không lời bạn có quyền sử dụng tại `assets/music.mp3`, hoặc sửa `CONFIG.musicSrc` để trỏ đến tệp phù hợp. Nên dùng đường dẫn tương đối để website hoạt động trong thư mục con trên GitHub Pages.

Âm thanh dùng phần tử `<audio>` của trình duyệt, lặp lại với âm lượng mặc định 30% và chỉ phát sau thao tác của người dùng. Người xem có thể bật hoặc tắt nhạc. Trình duyệt có thể áp dụng chính sách phát âm thanh riêng.

## Đưa lên GitHub Pages

1. Kiểm tra thay đổi, commit và push lên nhánh bạn muốn xuất bản. Việc tạo website trong workspace không tự commit hoặc push mã nguồn.
2. Trong repository trên GitHub, mở **Settings → Pages**.
3. Ở **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn nhánh `main` hoặc nhánh đã chứa website, chọn thư mục **`/ (root)`**, rồi **Save**.
5. Chờ GitHub triển khai và mở địa chỉ Pages được hiển thị. Tạo lại liên kết chia sẻ từ địa chỉ này để người khác truy cập được; liên kết `localhost` chỉ hoạt động trên máy của bạn.

Không cần thiết lập lệnh build. Nếu dùng nhánh khác, hãy đảm bảo nhánh đó có `index.html` ở thư mục gốc.

## Cấu trúc

```text
.
├── index.html              # Giao diện, CSS và JavaScript
├── README.md
├── assets/                # Thư mục tùy chọn, tự tạo khi thêm nhạc
│   └── music.mp3           # Không kèm sẵn; tự cung cấp khi có quyền sử dụng
├── tests/
│   └── test_browser.py     # Kiểm tra trình duyệt bằng Python Playwright
├── music_under.mp3         # Tệp cũ được giữ lại
├── music_over.mp3          # Tệp cũ được giữ lại
├── nhac_me.mp3             # Tệp cũ được giữ lại
└── nhac_ba.mp3             # Tệp cũ được giữ lại
```

`assets/music.mp3` không được cung cấp sẵn. Các tệp nhạc cũ không bị xóa.

## Kiểm tra

Website không cần phụ thuộc để chạy. Bộ kiểm tra trình duyệt trong `tests/test_browser.py` sử dụng **Python Playwright** và **Chromium của hệ thống**. Khi môi trường đã có các công cụ này, chạy từ thư mục dự án:

```bash
python3 tests/test_browser.py
```

Bộ kiểm tra chạy Chromium ở chế độ headless và mô phỏng kích thước màn hình; chưa kiểm tra trên điện thoại thật. Web Share, clipboard và tình huống trình duyệt từ chối phát âm thanh được kiểm tra bằng mô phỏng API. Việc gửi thành công qua bảng chia sẻ gốc trên thiết bị thật chưa được xác minh.

Kiểm tra điều hướng thực tế đến `file://` được bỏ qua vì chính sách quản lý của Chromium trong môi trường đám mây chặn thao tác này. Ứng dụng có thông báo hướng dẫn chạy qua HTTP khi cần tạo liên kết chia sẻ.

Kiểm tra giải mã và phát âm thanh thực dùng `music_under.mp3` sẵn có qua một đường dẫn tạm trong bộ kiểm tra. Tệp này chỉ phục vụ kiểm tra, không được gán làm nhạc nền của ứng dụng. Dự án vẫn chưa cung cấp `assets/music.mp3`; giao diện tiếp tục báo chưa có nhạc cho đến khi bạn thêm tệp nhạc không lời phù hợp.

Kiểm tra thủ công thêm trên điện thoại và máy tính: chọn từng nhóm người nhận và mẫu lời chúc, nhập tiếng Việt, mở/xem lại thiệp, điều hướng bằng bàn phím, bật giảm chuyển động và mở liên kết chia sẻ trong cửa sổ mới. Nếu đã thêm nhạc, kiểm tra cả nút bật/tắt âm thanh.

### Kết quả kiểm tra ngày 15/10/2026

`python3 tests/test_browser.py`: **20 đạt, 0 thất bại, 0 lỗi, 1 bỏ qua** (21 bài kiểm tra). Bài bỏ qua là mở trực tiếp `file://` do chính sách Chromium của môi trường.

Đã kiểm tra các màn hình chào, cá nhân hóa, phong bì và thiệp dài ở 360×800, 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080 và 844×390. Các luồng gồm sáu nhóm người nhận và biến thể, 24 mẫu khác nhau, dữ liệu tiếng Việt/ký tự HTML hiển thị an toàn, giới hạn 1.000 ký tự, giữ nội dung khi quay lại, mở lại thiệp, giảm chuyển động, liên kết nhận thiệp và dữ liệu lỗi, sao chép/chia sẻ dự phòng, thiếu nhạc, từ chối phát và bật/tắt liên tục.
