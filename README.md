# Gửi người phụ nữ tôi yêu thương

Website tạo và gửi thiệp Ngày Phụ nữ Việt Nam 20/10 bằng HTML, CSS và JavaScript. Chọn một bó hoa nở thành thiệp, một khu vườn giữa thiên hà hoặc phong thư thanh lịch; tự thiết kế dáng giấy, màu, trang trí và lời chúc. Ứng dụng, trình phát nhạc và bộ nén liên kết đều nằm trong `index.html`; phông chữ tiếng Việt được lưu tại `assets/fonts/`. Chạy trực tiếp trên máy chủ tĩnh, không cần backend, cài gói hay bước build.

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
3. Chọn một trong ba mẫu thiết kế có hình minh họa ngay đầu biểu mẫu. Mẫu đổi đồng thời dáng thiệp, màu, trang trí và không gian mở; tên và lời bạn viết được giữ nguyên.
4. Mở **Thiết kế theo cách của bạn** để chỉnh riêng từng chi tiết; nhập dòng đề tặng tối đa 100 ký tự hoặc tự viết toàn bộ lời chúc tối đa 3.000 ký tự. Để trống phần tự viết để dùng mẫu gợi ý. Nút đặt lại kiểu thiệp giữ lại nội dung bạn viết.
5. Chọn và nghe thử một bài nhạc có sẵn cho nhóm người nhận. Chạm mở thiệp để xem màn mở đầu, rồi chia sẻ hoặc sao chép liên kết đã tự động nén.

Ba mẫu khởi đầu:

| Mẫu | Thiết kế | Khoảnh khắc mở |
| --- | --- | --- |
| Một bó yêu thương | Vòm hoa, hồng sương, nhành hoa | Bó hoa bung mở, thiệp dâng lên giữa cánh bướm |
| Giữa ngàn tinh tú | Bưu thiếp xanh thiên hà, bố cục giữa, quỹ đạo sao | Vòng sao mở ra khu vườn hoa phát sáng |
| Xưởng lời thương | Lá thư champagne, hoa ép, chuyển động dịu nhẹ | Phong thư mở với cánh hoa |

Mặc định là bó hoa với thiệp vòm. Các mẫu chỉ là điểm bắt đầu; sau khi chọn, bạn có thể phối lại từng chi tiết. Bản xem trước cập nhật ngay: trên máy tính, thiệp lớn bám theo cuộn trang và cho cuộn bên trong khi lời chúc dài; trên điện thoại và tablet từ 900 px trở xuống, bản thu nhỏ nằm cạnh các tùy chỉnh trong bảng thiết kế, kèm nút **Xem thiệp lớn**.

Các lựa chọn thiết kế:

| Thành phần | Lựa chọn |
| --- | --- |
| Màu giấy | Hồng dịu dàng (`rose`), Khu vườn an yên (`sage`), Nắng champagne (`champagne`), Đêm ánh kim (`midnight`) |
| Nét chữ | Nét thư thanh lịch — Lora (`serif`), Hiện đại, dễ đọc — Manrope (`sans`) |
| Dáng thiệp | Lá thư viền đôi (`letter`), Vòm hoa (`arch`), Bưu thiếp có dải màu và tiêu đề riêng (`postcard`) |
| Bố cục | Lá thư riêng (`classic`), Cân đối, trang trọng (`centered`) |
| Trang trí | Nhành hoa (`botanical`), Ánh sao (`stars`), Tối giản (`minimal`) |
| Nét trang trí riêng | Hoa và nhành lá (`botanical`), Quỹ đạo ánh sao (`orbit`), Hoa ép trên giấy (`pressed`) |
| Không gian mở thiệp | Bó hoa (`bouquet`), Khu vườn giữa thiên hà (`galaxy`), Phong thư (`envelope`) |
| Nhịp chuyển động | Rực rỡ (`cinematic`), Dịu nhẹ (`gentle`) |
| Hiệu ứng khi nhận | Cánh hoa (`petals`), Trời sao (`constellation`), Cánh bướm (`butterflies`), Không hiệu ứng (`none`) |

Thiệp dài tự mở rộng, không cắt nội dung. Màn mở đầu chạy khoảng 1,8 giây ở chế độ rực rỡ hoặc 1,1 giây ở chế độ dịu nhẹ và có thể bỏ qua; khi hệ điều hành bật giảm chuyển động (`prefers-reduced-motion`), trang dùng chuyển cảnh nhẹ. Khu vườn, ánh sao và hoa nằm trong khu vực thiệp; hiệu ứng không che lời chúc hoặc nút điều khiển. Giao diện hỗ trợ điện thoại và thao tác bàn phím.

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

Người nhận có thể đổi giữa các bài đã có ở bộ chọn nhạc dưới trang. Bài được chọn được lưu trong liên kết thiệp. Ứng dụng dùng một phần tử `<audio>` để tránh phát chồng bài; có điều khiển bật/tắt và âm lượng mặc định 30%.

Khi người tạo hoặc người nhận **chạm mở thiệp**, ứng dụng đồng thời yêu cầu phát bài đã chọn. Nếu đang tìm tệp, yêu cầu được giữ để thử phát sau khi tìm xong. Nhạc không tự bật chỉ vì tải trang; nếu người dùng đã tắt nhạc, kết quả quét đến muộn không bật lại. Trình duyệt vẫn quyết định việc cho phát âm thanh: khi bị chặn hoặc bài còn thiếu, giao diện báo trạng thái và có nút nhạc để chạm phát lại.

## Chữ tiếng Việt và phông chữ

Lora và Manrope được đóng gói cục bộ với đầy đủ ký tự tiếng Việt; không tải phông từ CDN. Lora có bản thường và nghiêng để lời chúc, tên và chữ ký dùng cùng một họ chữ. Nội dung nhập vào được chuẩn hóa Unicode NFC để xử lý nhất quán dấu tiếng Việt. Giấy phép SIL Open Font License và nguồn tải nằm trong `assets/fonts/`.

Khi đưa website lên GitHub, cần đưa cả thư mục `assets/fonts/`; chỉ tải lên `index.html` sẽ thiếu phông chữ mới.

## Liên kết chia sẻ và quyền riêng tư

Tên, lời chúc, lời nhắn, thiết kế riêng và bài nhạc được đóng gói, bỏ các giá trị mặc định rồi **tự động nén ngay khi chia sẻ**. Liên kết mới dùng fragment `#c=` với dữ liệu đóng gói phiên bản 3. Bộ giải nén khôi phục cấu trúc thiệp phiên bản 2; các liên kết cũ `#card=` phiên bản 1 và 2 vẫn mở được. Cảnh mở, dáng giấy, trang trí và nhịp chuyển động cũng được giữ trong liên kết.

Bộ nén dùng mã LZ-string 1.5.0 (giấy phép MIT) đóng gói ngay trong `index.html`, không gọi CDN hoặc API. Quá trình nén chạy đồng bộ để giữ thao tác chạm hợp lệ cho bảng chia sẻ của trình duyệt. Dưới thiệp có số ký tự và phần trăm giảm thực tế của liên kết hiện tại. Một số dữ liệu đại diện đã đo có fragment giảm từ 709 xuống 152 ký tự (78,6%), 11.046 xuống 1.675 ký tự (84,8%) và 4.993 xuống 338 ký tự (93,2%); mức giảm phụ thuộc nội dung, không bảo đảm mọi thiệp có tỷ lệ tương tự.

Đây **không phải mã hóa bảo mật**: bất kỳ ai có liên kết đều có thể đọc nội dung; không đưa thông tin nhạy cảm vào thiệp.

Website không gửi nội dung thiệp đến dịch vụ rút gọn, không lưu thiệp trên backend và không cần khóa API. Phần fragment sau dấu `#` không được gửi trong yêu cầu HTTP tải trang thông thường, nhưng toàn bộ liên kết vẫn có thể xuất hiện trong lịch sử trình duyệt, ứng dụng nhắn tin hoặc nơi bạn dán liên kết. Nhạc và phông chữ vẫn được tải từ website như các tài nguyên thông thường.

Nén giúp liên kết gọn hơn nhưng không tạo được địa chỉ ngắn cố định, chẳng hạn 30 ký tự, cho mọi nội dung. Một lá thư dài gồm các ký tự ít lặp vẫn có thể tạo URL dài; giao diện cảnh báo khi cần. Muốn URL ngắn cố định cần nơi lưu nội dung thiệp và một mã tra cứu, như backend riêng hoặc dịch vụ bên thứ ba; bản website tĩnh này chưa có thành phần đó. Một số ứng dụng nhắn tin có thể giới hạn độ dài hoặc làm mất fragment. Hãy thử mở liên kết sau khi gửi; dùng nội dung ngắn hơn nếu ứng dụng cắt liên kết.

## Tùy chỉnh mã nguồn

| Vị trí trong `index.html` | Nội dung có thể đổi |
| --- | --- |
| `CONFIG` trong ứng dụng | Tên website, người gửi mặc định, giới hạn ký tự và thời lượng/số lượng hiệu ứng |
| `GREETINGS` | 24 mẫu lời chúc; giữ các biến `{self}` và `{you}` |
| `RECIPIENTS` | Nhóm người nhận, biến thể và cách xưng hô mặc định |
| `CardMusic` → `definitions` | Tên gốc MP3 (`stem`) và đường dẫn nhạc cũ (`legacy`) của từng nhóm |
| `CardMusic` → `setGroup` | Phạm vi quét 20 bài, số thứ tự từ 0 đến 19 |
| `DESIGN_PRESETS` | Ba tổ hợp kiểu thiệp; giữ nội dung người dùng khi đổi mẫu |
| `CardLinks` | Nén/giải nén liên kết mới và đọc liên kết cũ; giữ nguyên thông báo bản quyền MIT |
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
├── index.html                 # Giao diện, CSS, ứng dụng, nhạc và bộ nén liên kết
├── README.md
├── .gitignore                 # Bỏ qua đầu ra/cache cục bộ
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
│   ├── test_upgrade.py        # Chữ tiếng Việt, thiết kế riêng, nhạc và chia sẻ
│   └── test_wow.py            # Preset, cảnh mở, URL nén, nhạc và điện thoại
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
python3 tests/test_wow.py
```

Có thể đặt `BASE_URL` nếu máy chủ không chạy tại `http://127.0.0.1:8000/`, hoặc `CHROMIUM_PATH` nếu Chromium được cài ở đường dẫn khác `/usr/bin/chromium`. Bộ đầu kiểm tra luồng tạo/gửi thiệp; bộ thứ hai kiểm tra thiết kế, phông chữ và thư viện nhạc theo nhóm; bộ thứ ba kiểm tra các cảnh mở, URL nén và hành vi mới trên điện thoại.

Bộ kiểm tra nâng cấp bao phủ dấu tiếng Việt và phông cục bộ; mẫu lời chúc và thiết kế riêng; liên kết v1/v2; tên bài theo nhóm, nhạc cũ và bài thiếu; đổi bài, bật/tắt và phục hồi khi bổ sung nhạc; nội dung dài và màn hình điện thoại/máy tính. Các kịch bản cung cấp bài bổ sung dùng MP3 thật có sẵn trong repository qua tuyến HTTP mô phỏng, không tạo thêm bài nhạc vào mã nguồn.

`test_wow.py` bổ sung các kiểm tra đổi preset mà giữ lời viết, ba dáng thiệp và ba cảnh mở; nén/giải nén đầy đủ dữ liệu và từ chối liên kết hỏng; mở liên kết cũ; phát nhạc từ thao tác mở; bỏ qua/giảm chuyển động và giới hạn phần trang trí trên các kích thước màn hình. Không suy ra kết quả bản hiện tại từ số bài đã đạt ở một phiên bản trước.

Kiểm thử dùng Chromium headless và mô phỏng kích thước màn hình, chưa thay thế kiểm tra trên điện thoại thật. Các tình huống Web Share, clipboard hoặc trình duyệt từ chối phát âm thanh có thể dùng mô phỏng API; cần thử bảng chia sẻ và chính sách phát nhạc trên thiết bị thực tế. Môi trường đám mây có thể chặn điều hướng tới `file://`; chạy qua HTTP để kiểm tra luồng đầy đủ.

Trước khi merge, kiểm tra thủ công trên máy tính và điện thoại: nhập tên có dấu, chọn mỗi nhóm, đổi cả ba preset và các dáng thiệp, đổi bài nhạc, mở/xem lại, bỏ qua màn mở đầu, bật/tắt nhạc, mở liên kết nén trong cửa sổ mới và thử tùy chọn giảm chuyển động. Sau khi merge, kiểm tra lại các thao tác này ở địa chỉ GitHub Pages.

### Kết quả kiểm tra bản bó hoa và thiên hà — 16/10/2026

- **54 bài đạt, 0 thất bại, 0 lỗi; 1 bài bỏ qua** do chính sách Chromium chặn `file://` trước khi trang chạy.
- `test_browser.py`: 20 đạt, 1 bỏ qua; `test_upgrade.py`: 19 đạt; `test_wow.py`: 15 đạt.
- Bộ mới kiểm tra ba preset đổi hình dáng rõ ràng, xem trước bám theo trên điện thoại, ba cảnh mở bằng bàn phím, bỏ qua/giảm chuyển động, tự phát nhạc thật từ thao tác mở và nhạc đang dò đến muộn, liên kết nén/Unicode/thiết kế/nhạc, liên kết v1/v2, dữ liệu nén lỗi hoặc nở quá giới hạn.
- Chạy đầy đủ ba dáng thiệp với lời chúc 3.000 ký tự và lời nhắn 1.000 ký tự ở chín viewport; hình minh họa và chữ tiếng Việt đã được xem trực tiếp qua ảnh chụp Chromium ở 390 px và 1440 px. Phần vườn hoa có khoảng riêng dưới phần chia sẻ, không nằm sau các nút hay lời nhắn.
- Bộ codec cũng đã kiểm tra 264 lượt nén/giải nén và từ chối đầu vào nén vượt giới hạn. Các bài nhạc bổ sung trong kiểm thử dùng tuyến HTTP với dữ liệu âm thanh thật, không phải 14 tệp mới được cung cấp sẵn.

Kết quả này được kiểm tra trên Chromium trong môi trường phát triển, chưa xác nhận triển khai GitHub Pages của commit mới hoặc thiết bị iPhone/Android thật.
