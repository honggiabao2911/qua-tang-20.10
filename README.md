# Gửi người phụ nữ tôi yêu thương

Website tạo và gửi thiệp Ngày Phụ nữ Việt Nam 20/10 bằng HTML, CSS và JavaScript thuần. Giao diện, nội dung, phong bì 3D và trình phát nhạc nằm trong `index.html`; phông chữ tiếng Việt được lưu tại `assets/fonts/`. Không cần backend, thư viện để chạy hay bước build.

## Chạy trên máy

Từ thư mục dự án, chạy:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở <http://127.0.0.1:8000> trong trình duyệt. Dừng máy chủ bằng `Ctrl+C`. Có thể dùng Live Server của VS Code hoặc máy chủ xem trước của PyCharm.

Hãy chạy qua HTTP để quét nhạc và tạo liên kết chia sẻ. Mở `index.html` trực tiếp bằng `file://` chịu các hạn chế của trình duyệt, không phải cách chạy đầy đủ tính năng. Liên kết dùng địa chỉ `localhost` chỉ mở được trên máy của bạn; khi gửi cho người khác, tạo liên kết trên địa chỉ GitHub Pages đã triển khai.

## Tạo một tấm thiệp riêng

1. Chọn người nhận: mẹ, bà, cô giáo, chị/em gái, bạn bè hoặc những người phụ nữ bạn trân quý. Mỗi nhóm có ba mẫu lời chúc; các biến thể chị/em và cá nhân/tập thể có nội dung riêng, tổng cộng 24 mẫu.
2. Nhập tên người nhận, người gửi và cách xưng hô. Tên người gửi mặc định là **Hồng Gia Bảo**. Có thể thêm lời nhắn riêng tối đa 1.000 ký tự.
3. Mở **Thiết kế theo cách của bạn** để chọn màu giấy, nét chữ, bố cục và trang trí; nhập dòng đề tặng tối đa 100 ký tự hoặc tự viết toàn bộ lời chúc tối đa 3.000 ký tự. Để trống phần tự viết để dùng mẫu gợi ý. Nút đặt lại kiểu thiệp giữ lại nội dung bạn viết.
4. Chọn và nghe thử một bài nhạc có sẵn cho nhóm người nhận. Mở phong bì để xem thiệp, rồi chia sẻ hoặc sao chép liên kết.

Các lựa chọn thiết kế:

| Thành phần | Lựa chọn |
| --- | --- |
| Màu giấy | Hồng dịu dàng (`rose`), Khu vườn an yên (`sage`), Nắng champagne (`champagne`), Đêm ánh kim (`midnight`) |
| Nét chữ | Nét thư thanh lịch — Lora (`serif`), Hiện đại, dễ đọc — Manrope (`sans`) |
| Bố cục | Lá thư riêng (`classic`), Cân đối, trang trọng (`centered`) |
| Trang trí | Nhành hoa (`botanical`), Ánh sao (`stars`), Tối giản (`minimal`) |
| Hiệu ứng khi nhận | Cánh hoa (`petals`), Trời sao (`constellation`), Cánh bướm (`butterflies`), Không hiệu ứng (`none`) |

Thiệp dài tự mở rộng, không cắt nội dung. Hiệu ứng chỉ chạy ngắn khi mở thiệp; tự tắt khi hệ điều hành bật giảm chuyển động (`prefers-reduced-motion`). Giao diện hỗ trợ điện thoại và thao tác bàn phím.

## Nhạc theo nhóm người nhận

Bốn tệp nhạc cũ vẫn được giữ nguyên và đã được dùng làm bản đầu tiên cho bốn nhóm. Không cần đổi tên hoặc sao chép chúng. Mỗi nhóm luôn hiển thị ít nhất ba vị trí chọn bài, nhưng chỉ bài có tệp âm thanh thật mới phát được.

Đặt các MP3 mới ở **thư mục gốc** cùng `index.html` hoặc trong **`assets/`**. Ứng dụng tự tìm các tên sau, ưu tiên thư mục gốc trước `assets/`:

| Người nhận | Bản 1 | Bản 2 | Bản 3 | Tệp cũ dùng cho bản 1 nếu chưa có tên mới |
| --- | --- | --- | --- | --- |
| Mẹ | `0nhacme.mp3` | `1nhacme.mp3` | `2nhacme.mp3` | `nhac_me.mp3` — đã có |
| Bà | `0nhacba.mp3` | `1nhacba.mp3` | `2nhacba.mp3` | `nhac_ba.mp3` — đã có |
| Cô giáo | `0nhacco.mp3` | `1nhacco.mp3` | `2nhacco.mp3` | `assets/music.mp3` — chưa có |
| Chị / Em gái | `0nhacchiem.mp3` | `1nhacchiem.mp3` | `2nhacchiem.mp3` | `assets/music.mp3` — chưa có |
| Bạn bè | `0nhacban.mp3` | `1nhacban.mp3` | `2nhacban.mp3` | `music_under.mp3` — đã có |
| Những người phụ nữ | `0nhacphunu.mp3` | `1nhacphunu.mp3` | `2nhacphunu.mp3` | `music_over.mp3` — đã có |

Riêng bản đầu tiên còn chấp nhận tên không có số: `nhacme.mp3`, `nhacba.mp3`, `nhacco.mp3`, `nhacchiem.mp3`, `nhacban.mp3`, `nhacphunu.mp3`. Thứ tự tìm bản đầu là tên có số `0`, tên không số, rồi tên cũ. Những tên ở bảng giúp quản lý thống nhất.

**Để mỗi nhóm hiện có đủ ba bài thật, cần thêm 14 tệp:**

```text
1nhacme.mp3       2nhacme.mp3
1nhacba.mp3       2nhacba.mp3
0nhacco.mp3       1nhacco.mp3       2nhacco.mp3
0nhacchiem.mp3    1nhacchiem.mp3    2nhacchiem.mp3
1nhacban.mp3      2nhacban.mp3
1nhacphunu.mp3    2nhacphunu.mp3
```

Hãy dùng các bài MP3 thật, khác nhau nếu muốn có ba lựa chọn nghe khác nhau, và có quyền sử dụng. Không tạo tệp rỗng hoặc đổi đuôi một tệp khác thành `.mp3`. Giữ tên tệp chữ thường đúng như bảng; GitHub Pages phân biệt hoa/thường, nên `.MP3` không khớp `.mp3`.

Có thể thêm tiếp `3nhacme.mp3`, `4nhacme.mp3`… đến `19nhacme.mp3`, tương tự cho mọi nhóm, **không phải sửa JavaScript**. Bấm **Kiểm tra lại các bài nhạc** hoặc tải lại trang sau khi thêm tệp. Trên GitHub Pages, cần commit, push và chờ triển khai xong trước khi kiểm tra lại. Giao diện hiển thị tên tệp còn thiếu để bạn bổ sung; bài thiếu không bị phát giả hoặc thay âm thầm bằng bài khác.

Người nhận có thể đổi giữa các bài đã có ở bộ chọn nhạc dưới trang. Bài được chọn được lưu trong liên kết thiệp. Ứng dụng dùng một phần tử `<audio>` để tránh phát chồng bài; có điều khiển bật/tắt và âm lượng mặc định 30%. Nếu bạn đã tắt nhạc, chuyển bài không tự bật lại. Trình duyệt có thể yêu cầu người nhận chạm nút nhạc trước khi cho phát âm thanh.

## Chữ tiếng Việt và phông chữ

Lora và Manrope được đóng gói cục bộ với đầy đủ ký tự tiếng Việt; không tải phông từ CDN. Lora có bản thường và nghiêng để lời chúc, tên và chữ ký dùng cùng một họ chữ. Nội dung nhập vào được chuẩn hóa Unicode NFC để xử lý nhất quán dấu tiếng Việt. Giấy phép SIL Open Font License và nguồn tải nằm trong `assets/fonts/`.

Khi đưa website lên GitHub, cần đưa cả thư mục `assets/fonts/`; chỉ tải lên `index.html` sẽ thiếu phông chữ mới.

## Liên kết chia sẻ và quyền riêng tư

Tên, lời chúc, lời nhắn, thiết kế riêng và bài nhạc được lưu trong JSON phiên bản 2 ở phần sau dấu `#` của URL. Liên kết phiên bản 1 cũ vẫn được hỗ trợ. Đây **không phải mã hóa bảo mật**: bất kỳ ai có liên kết đều có thể đọc nội dung; không đưa thông tin nhạy cảm vào thiệp.

Website không cần máy chủ lưu thiệp. Phần fragment sau dấu `#` không được gửi trong yêu cầu HTTP tải trang thông thường, nhưng toàn bộ liên kết vẫn có thể xuất hiện trong lịch sử trình duyệt, ứng dụng nhắn tin hoặc nơi bạn dán liên kết. Nhạc và phông chữ vẫn được tải từ website như các tài nguyên thông thường.

Lời chúc tự viết dài tạo đường dẫn dài; giao diện có cảnh báo khi cần. Một số ứng dụng nhắn tin hoặc dịch vụ rút gọn liên kết có thể giới hạn độ dài hay làm mất fragment. Hãy thử mở liên kết sau khi gửi; dùng nội dung ngắn hơn nếu ứng dụng cắt liên kết.

## Tùy chỉnh mã nguồn

| Vị trí trong `index.html` | Nội dung có thể đổi |
| --- | --- |
| `CONFIG` trong ứng dụng | Tên website, người gửi mặc định, giới hạn ký tự và thời lượng/số lượng hiệu ứng |
| `GREETINGS` | 24 mẫu lời chúc; giữ các biến `{self}` và `{you}` |
| `RECIPIENTS` | Nhóm người nhận, biến thể và cách xưng hô mặc định |
| `CardMusic` → `definitions` | Tên gốc MP3 (`stem`) và đường dẫn nhạc cũ (`legacy`) của từng nhóm |
| `CardMusic` → `setGroup` | Phạm vi quét 20 bài, số thứ tự từ 0 đến 19 |
| CSS `:root`, các phần CSS xưởng thiệp và phông chữ | Màu nhận diện, bốn bảng màu thiệp và kiểu chữ |

Thêm MP3 theo đúng tên không cần sửa các phần này. Giữ các khóa dữ liệu được mã nguồn sử dụng khi đổi mẫu lời chúc hoặc cấu hình. Nếu đổi giới hạn nội dung, kiểm tra lại liên kết chia sẻ.

## Đưa bản mới lên GitHub Pages

Mã nguồn trong workspace không tự xuất hiện trên GitHub Pages. Với repository `honggiabao2911/qua-tang-20.10`, đưa thay đổi lên nhánh **`codex/20-10-premium`**, tạo Pull Request vào **`main`**, kiểm tra rồi merge. Không ghi đè trực tiếp `main` hoặc xóa các tệp nhạc cũ.

Sau khi merge:

1. Mở **Settings → Pages** trên GitHub.
2. Ở **Build and deployment**, chọn **Deploy from a branch**.
3. Chọn nhánh **`main`**, thư mục **`/ (root)`**, rồi **Save** nếu cần.
4. Chờ lần triển khai Pages trong **Actions** hoàn tất. Mở địa chỉ Pages mà GitHub hiển thị và tải lại trang; nếu còn thấy giao diện cũ, thử tải lại bỏ bộ nhớ đệm hoặc cửa sổ riêng tư.
5. Tạo liên kết thiệp từ địa chỉ Pages này để gửi cho người nhận.

Không cần lệnh build. Cần commit `index.html`, `README.md`, `assets/fonts/` và các tệp nhạc thật được thêm vào. Việc tài liệu mô tả bản mới không xác nhận bản đó đã được triển khai; kiểm tra commit của lần triển khai Pages thực tế.

## Cấu trúc

```text
.
├── index.html                 # Giao diện, CSS, ứng dụng và trình phát nhạc
├── README.md
├── assets/
│   └── fonts/
│       ├── lora.woff2          # Lora thường, gồm tiếng Việt
│       ├── lora-italic.woff2   # Lora nghiêng, gồm tiếng Việt
│       ├── manrope.woff2       # Manrope, gồm tiếng Việt
│       ├── lora-OFL.txt
│       ├── manrope-OFL.txt
│       └── README.md          # Nguồn và thông tin phông chữ
├── tests/
│   ├── test_browser.py        # Luồng tạo thiệp và các kiểm tra cơ bản
│   └── test_upgrade.py        # Chữ tiếng Việt, thiết kế riêng, nhạc và chia sẻ
├── music_under.mp3            # Giữ nguyên; dùng cho nhóm bạn bè
├── music_over.mp3             # Giữ nguyên; dùng cho nhóm phụ nữ
├── nhac_me.mp3                # Giữ nguyên; dùng cho mẹ
└── nhac_ba.mp3                # Giữ nguyên; dùng cho bà
```

Các bài bổ sung theo tên ở bảng có thể đặt ở gốc hoặc `assets/`. Không kèm sẵn `assets/music.mp3` hay 14 bài mới còn thiếu.

## Kiểm tra

Website không cần phụ thuộc để chạy. Bộ kiểm tra dùng **Python Playwright** và **Chromium của hệ thống**. Khi môi trường đã có hai công cụ này, bật máy chủ HTTP như hướng dẫn ở trên, rồi chạy bộ kiểm tra bản nâng cấp trong một terminal khác:

```bash
python3 tests/test_browser.py
python3 tests/test_upgrade.py
```

Có thể đặt `CHROMIUM_PATH` nếu Chromium được cài ở đường dẫn khác `/usr/bin/chromium`. Cả hai bộ kiểm tra đều đã được cập nhật cho thư viện nhạc theo nhóm; bộ đầu kiểm tra luồng tạo/gửi thiệp, bộ thứ hai kiểm tra phần nâng cấp và hồi quy.

Bộ kiểm tra nâng cấp bao phủ dấu tiếng Việt và phông cục bộ; mẫu lời chúc và thiết kế riêng; liên kết v1/v2; tên bài theo nhóm, nhạc cũ và bài thiếu; đổi bài, bật/tắt và phục hồi khi bổ sung nhạc; nội dung dài và màn hình điện thoại/máy tính. Các kịch bản cung cấp bài bổ sung dùng MP3 thật có sẵn trong repository qua tuyến HTTP mô phỏng, không tạo thêm bài nhạc vào mã nguồn.

Kiểm thử dùng Chromium headless và mô phỏng kích thước màn hình, chưa thay thế kiểm tra trên điện thoại thật. Các tình huống Web Share, clipboard hoặc trình duyệt từ chối phát âm thanh có thể dùng mô phỏng API; cần thử bảng chia sẻ và chính sách phát nhạc trên thiết bị thực tế. Môi trường đám mây có thể chặn điều hướng tới `file://`; chạy qua HTTP để kiểm tra luồng đầy đủ.

Trước khi merge, kiểm tra thủ công trên máy tính và điện thoại: nhập tên có dấu, chọn mỗi nhóm, đổi kiểu thiệp và bài nhạc, mở/xem lại, bật/tắt nhạc, mở liên kết trong cửa sổ mới và thử tùy chọn giảm chuyển động.

### Kết quả kiểm tra bản sửa ngày 15/10/2026

- Tổng cộng: **39 bài đạt, 0 thất bại, 0 lỗi; 1 bài file:// bỏ qua do chính sách Chromium**.
- Bộ cơ bản: **20 đạt, 1 bỏ qua**. Bộ nâng cấp: **19/19 đạt**, gồm cả tình huống tắt nhạc trong lúc đang quét lại; kết quả quét đến muộn không tự bật nhạc.
- Đã mở và đánh giá giao diện Chromium trên máy tính và màn hình cảm ứng mô phỏng 390×844; Lora/Manrope tải từ chính website, các dấu tiếng Việt hiển thị đầy đủ, nhạc Bà phát trực tiếp từ `nhac_ba.mp3`.
- Kiểm tra đủ tám viewport yêu cầu và màn hình ngang 844×390; thư mục con như GitHub Pages cũng được kiểm tra. Các bài bổ sung trong kiểm thử là tuyến HTTP dùng dữ liệu âm thanh thật, không phải 14 tệp được cung cấp sẵn.
