# Lời thương · Thiệp 20/10

Website thiệp chúc mừng bằng HTML, CSS, JavaScript thuần. Người nhận được đón bằng bó hoa lớn từ 2.450 hạt sáng (1.250 trên điện thoại) hoặc hoa mọc nở, kèm lời tặng hoa nhân ngày 20/10, rồi nhấn **Nhận hoa và mở lời chúc** để tiếp tục. Màn đầu không hiển thị tấm thiệp. Tạo lời chúc theo quan hệ, chọn thiết kế từ 22 chủ đề, nghe thử nhạc và chia sẻ nguyên tấm thiệp. Không cần backend, tài khoản, thư viện từ CDN hoặc bước build. Font tiếng Việt nằm trong dự án.

## Chạy và triển khai

Trong thư mục dự án:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Dùng trình duyệt trên máy chạy lệnh để mở cổng 8000. Có thể dùng Live Server. Cần phục vụ qua HTTP/HTTPS để kiểm tra tệp nhạc; `file://` không hỗ trợ đầy đủ. Khi gửi thiệp cho người khác, tạo liên kết từ địa chỉ website đã triển khai, không dùng địa chỉ máy cá nhân.

GitHub Pages: trong **Settings → Pages**, chọn **Deploy from a branch → main → /(root)**. Merge Pull Request từ `codex/20-10-premium` vào `main`, rồi chờ tác vụ Pages hoàn tất. Khi tải thủ công, phải đưa lên cả `index.html` và thư mục `assets/`; các module mới không còn nằm hết trong HTML. Giữ các MP3 cũ tại thư mục gốc.

## Tạo một món quà riêng

1. Chọn một trong đúng 6 nhóm: **Mẹ, Bà, Cô giáo, Chị/em gái, Bạn nữ/nhóm phụ nữ, Người thương**. Chọn chị hay em, bạn nữ hay nhóm phụ nữ ở phần quan hệ bên trong, thay vì thêm nhóm ngoài trang chủ. Mỗi quan hệ có ít nhất 6 lời gợi ý; sắc thái gồm ngắn gọn, ấm áp, vui vẻ, xúc động, thêm ngọt ngào và lãng mạn cho người thương.
2. Chọn cặp xưng hô hoặc sửa cả cách xưng và cách gọi. Khi đổi quan hệ, cặp xưng hô và lời mẫu cập nhật cùng nhau. Lời tự viết được giữ kèm lựa chọn **Giữ lời tôi viết / Dùng mẫu mới**.
3. Tên người gửi mặc định trống. Nếu không có tên, toàn bộ chữ ký được ẩn. Không lưu bản nháp vào bộ nhớ trình duyệt và không tự điền tên chủ dự án.
4. Lọc chủ đề theo **Rực rỡ, Dịu dàng, Lãng mạn, Thanh nhã, Kỳ ảo**, rồi chọn hình thu nhỏ. **Phối giúp tôi** chuyển giữa các tổ hợp được chọn theo người nhận; **Phối sẵn theo chủ đề** phục hồi phối cảnh mà vẫn giữ nội dung.
5. Xem thử cảnh mở đầy đủ trong hộp xem trước, hoặc nhảy đến **Bắt đầu / Món quà hoàn chỉnh / Đọc lời chúc**. Bản xem trước dùng cùng bộ dựng cảnh với thiệp thật, không phát nhạc; đóng hộp sẽ dừng và giải phóng cảnh.
6. Chỉnh chi tiết, chọn nhạc rồi mở thiệp thật. Người nhận chạm nút hoặc vật thể chính để mở; thao tác đó kích hoạt nhạc nếu bài có tệp và trình duyệt cho phép. Các cảnh quà mới giữ món quà hoàn chỉnh để ngắm đến khi người nhận chọn đọc. Có nút bỏ qua, xem lại và **Giữ lại khoảnh khắc** để tạm dừng chuyển động.

Lời tự viết tối đa 3.000 đơn vị UTF-16, lời nhắn riêng và lời nhắn phụ tối đa 1.000; bộ đếm và giới hạn dùng cùng cách đếm với ô nhập HTML. Tên tối đa 100, cách xưng/cách gọi 30. Câu mở quà tối đa 160; cây lời nhắn cho phép tối đa 5 lời ngắn, mỗi lời tối đa 160. Các lời trên hoa hoàn toàn tùy chọn: để trống thì chỉ có hoa trang trí, không tự sinh kỷ niệm. Nội dung nhập được chuẩn hóa Unicode NFC và hiển thị bằng `textContent`.

## Bó hoa lớn khi nhận thiệp

Thiệp mới mặc định dùng **Bó hoa từ ngàn hạt sáng**. Có thể chọn **Bó hoa mọc lên và bung nở** hoặc **Dùng cảnh mở trong thư viện**. Hai kiểu bó hoa chỉ hiện hoa và lời tặng 20/10, không đặt tấm thiệp ở giữa bó. Khi nhấn **Nhận hoa và mở lời chúc**, cả bó hoa rung nhẹ như một khối rồi **cảnh chủ đề đã chọn tiếp tục mở đầy đủ**: đảo hoa, cây lời nhắn, ngân hà hoặc một trong 22 chủ đề. Nhạc bắt đầu từ thao tác chạm ban đầu và tiếp tục xuyên suốt, không phát lại khi chuyển cảnh. Với 10 cảnh quà có trạng thái hoàn chỉnh, người nhận tự chọn đọc sau khi ngắm món quà.

Khi đọc, cảnh chủ đề hiện lớn cạnh lời chúc trên desktop, phía trên thiệp trên điện thoại; cây/hoa/quỹ đạo vẫn ở lại, giữ chuyển động nhẹ và tương tác. Không giấu cảnh trong một dấu nhỏ trên giấy hay chỉ đặt tận cuối trang. Phần lựa chọn màn đón có hình minh họa, mô tả chuỗi mở, hình chủ đề cập nhật trực tiếp và nút **Xem trọn luồng này** cho cả ba lựa chọn. Chế độ giảm/tắt chuyển động vẫn hiện đầy đủ món quà tĩnh.

Phần đón bó hoa dùng canvas điểm sáng định vị theo cánh/nhụy/lá/cành và hình SVG 23 đóa hoa, giấy gói, nơ. Cành bắt đầu tại tâm mỗi hoa; cành, hoa, giấy gói và điểm sáng cùng chuyển động, không tách hai nửa. Giới hạn DPR 1,5 và giảm mật độ trên thiết bị yếu. Nhịp vẽ hạt sáng tối đa 30 lần/giây lúc xuất hiện, 20 khi đã ổn định (24/12 trên máy yếu); SVG rung nhẹ vẫn dùng CSS. Quầng sáng được vẽ sẵn theo màu và tái sử dụng, không tạo radial gradient trong mỗi khung hình. Giảm số lớp cánh/nhụy và bỏ các filter trên từng bông hoa. Dừng vòng vẽ khi ẩn, chuyển màn hoặc bật giảm chuyển động; bản tĩnh vẫn có đầy đủ bó hoa. Liên kết lưu `design.arrival`; liên kết cũ chưa có trường này giữ cảnh đã chọn.

Nhạc riêng khi làm thiệp lấy từ **`nhac.mp3` ở thư mục gốc**, âm lượng độc lập với nhạc người nhận. Hiện chưa có tệp này: thêm bản thu của bạn để nghe. Thiếu tệp không chặn tạo thiệp. Không tự phát khi tải trang và chỉ có một audio hoạt động. Các dòng gợi ý chọn nhạc đã được bỏ.

## 22 chủ đề và cảnh mở quà

Mười cảnh quà mới có trạng thái bắt đầu, chuyển đổi, quà hoàn chỉnh và đọc lời chúc. Hình đại diện và bản xem trước lấy từ chính đồ họa dùng khi nhận thiệp.

| Cảnh quà mới | Quá trình mở và phần trang trí khi đọc | Tương tác |
| --- | --- | --- |
| Chiếc ô và cơn mưa hóa hoa | Ô bung; mưa chạm ô đổi thành cánh hoa, tụ thành bó hoa dưới cán | Chạm mở ô, chọn thẻ lời nhắn |
| Cuốn sách mở ra khu vườn cổ tích | Bìa sách mở, lớp giấy và cây hoa dựng lên, lối sáng dẫn tới thư | Chạm bìa, rồi chọn thư trong vườn |
| Hòn đảo hoa lơ lửng | Đảo đến giữa tầng mây; cây và hoa xuất hiện; ruy băng mang thiệp | Mở thiệp trước đảo hoa |
| Đại dương phát sáng | Vỏ trai hé ngọc, ánh ngọc kết thành bó hoa pha lê | Chạm nền tạo gợn nước và phù du |
| Khinh khí cầu chở hoa | Khinh khí cầu hạ xuống, giỏ hoa bung, thư được thả bằng lụa | Chạm thư; khinh khí cầu neo bên vùng đọc |
| Đèn lồng gửi lời thương | Đèn bay lên giữa hồ chạng vạng, ánh sáng kết vòng hoa quanh thiệp | Mở đèn; có câu mở tùy chọn |
| Cây hoa mang những lời nhắn | Hạt sáng thành cây, các cụm hoa lần lượt nở | Chạm tối đa 5 hoa có lời nhắn; luôn có nút đọc đầy đủ |
| Dải lụa mở ra bó hoa | Nơ tháo, lụa dẫn qua lớp giấy gói, hé bó hoa và thẻ nhỏ | Chạm nơ, chọn thẻ trên bó hoa |
| Cầu ánh sáng đến vườn hoa | Phiến sáng và hoa hiện theo lối đi, vòm hoa mở tới món quà | Chọn thiệp sau khi góc nhìn dừng |
| Hộp nhạc và vòng hoa xoay | Nắp hộp mở, hoa nâng lên thành vòng, thư cuộn hé phía trước | Chạm nắp rồi chọn thư; dùng đúng bài nhạc đã chọn |

Mười hai không gian trước đây vẫn có thể chọn:

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

Các cảnh cũ mở trong khoảng 2–2,8 giây; cảnh quà mới có nhiều bước rồi giữ ở trạng thái hoàn chỉnh, không tự biến mất ngay. Hiệu ứng sau khi đọc chạy chậm, có giới hạn; tương tác đặc biệt chỉ ở vùng trang trí và không chiếm thao tác cuộn. Chuyển động dừng khi ẩn tab, giảm mật độ theo thiết bị và tuân thủ `prefers-reduced-motion`; giảm chuyển động vẫn giữ hình dáng món quà. Đồ họa SVG/CSS tự tạo, không lấy emoji phóng lớn làm tranh chính. Không yêu cầu camera, microphone hay cảm biến.

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

Đã đồng bộ **6 tệp chuẩn cho Mẹ**, từ `assets/music/0me.mp3` đến `5me.mp3`, do bạn tải lên `main`. Cả sáu là MP3 hợp lệ. Ba vị trí khác vẫn nghe được bằng tệp cũ: `ba:0` → `nhac_ba.mp3`, `nu:0` → `music_under.mp3`, `nu:1` → `music_over.mp3`. Tổng cộng 9/36 vị trí có nguồn âm thanh; **27 vị trí chưa có bản thu**: `1–5ba`, `0–5co`, `0–5chi`, `2–5nu`, `0–5yeu` (đều đuôi `.mp3`). Còn 30 đường dẫn chuẩn chưa có tệp vật lý. Giữ nguyên mọi tệp cũ và các tệp `.MP3` bạn đã tải ở thư mục gốc; website ưu tiên bản chữ thường trong `assets/music/`.

Xem [MUSIC.md](MUSIC.md) để có danh sách thiếu, bảng chuyển tên và nhạc riêng khi tạo thiệp. Tên bài/nghệ sĩ trong `assets/music/catalog.json` chỉ nên điền sau khi xác định đúng bản thu.

Chỉ có một phần tử audio. Trình phát kiểm tra HEAD cho nhóm được chọn, tải metadata của bài được chọn, không tải trước 36 bài. Có nghe thử, phát/dừng, trước/sau, âm lượng và kiểm tra lại tệp. Không tự phát khi bắt đầu nhập liệu hoặc xem trước cảnh; thiếu nhạc không ngăn mở thiệp. Cảnh hộp nhạc cũng dùng bài người gửi chọn, không tạo nhạc riêng phát chồng. Lựa chọn tắt nhạc được giữ khi xem lại. Nếu hệ điều hành không cho điều chỉnh âm lượng qua web, dùng nút âm lượng điện thoại.

## Liên kết giữ đúng tấm thiệp

Định dạng `#c=` chọn bản ngắn hơn giữa dữ liệu v4 và v5. V5 dùng bảng ký tự/cụm từ tiếng Việt cố định trước khi nén LZ; Latin-1 được escape để giữ chính xác văn bản đa ngôn ngữ, có giới hạn trong lúc mở rộng. API giải mã trả về cùng snapshot v4; v1/v2/v3/v4 cũ vẫn đọc nguyên vẹn. Liên kết lưu nguyên văn lời chúc đã render, cặp xưng hô, người nhận/gửi, lời nhắn, mọi lựa chọn thiết kế, ID cảnh quà, câu mở quà, các lời nhắn trên hoa, nhạc và âm lượng. Các trường mới được thêm ở cuối dữ liệu v4 để thiệp v4 trước đó vẫn đọc được. Thay đổi danh sách mẫu sau này không làm lời chúc đã gửi đổi theo. Không tạo mã ngắn qua dịch vụ bên ngoài; độ dài vẫn phụ thuộc nội dung.

Đọc được liên kết `#card=` v1/v2 và `#c=` packed v3 của các bản trước. Dữ liệu lời cũ được giữ riêng; nhạc cũ `women:0` được chuyển sang vị trí tương ứng `women:1`. Tên đã có trong dữ liệu thiệp cũ vẫn được tôn trọng. Người dùng mới luôn bắt đầu với ô tên trống.

Giới hạn kích thước cả trước và trong giải nén; kiểm tra phiên bản, kiểu dữ liệu, lựa chọn, khóa nguy hiểm và độ sâu JSON. Sao chép chỉ báo thành công khi API thành công; có ô sao chép thủ công. Liên kết chứa nội dung tấm thiệp: bất kỳ ai có liên kết đều đọc được, kể cả lời nhắn mở bằng nút riêng.

## Các tệp cấu hình

| Tệp | Vai trò |
| --- | --- |
| `index.html` | Cấu trúc trang, CSS nền và các cảnh cũ còn dùng cho liên kết trước đây |
| `assets/js/app.js` | Trạng thái, giao diện, cặp xưng hô, chia sẻ và kiểm tra dữ liệu |
| `assets/js/greetings.js` | 54 lời chúc, sắc thái, cặp xưng hô, các trường template rõ ràng |
| `assets/js/legacy-greetings.js` | Nguyên văn 24 lời chúc của liên kết cũ |
| `assets/js/themes.js` | Danh mục chủ đề, 12 không gian cũ và kết nối cảnh quà mới |
| `assets/js/bouquet-arrival.js`, `assets/css/bouquet-arrival.css` | Bó hoa lớn, lời tặng 20/10, cành và hoa chuyển động liền nhau, vòng đời canvas |
| `assets/css/reception.css` | Màn tạo thiệp, nhạc riêng và hiệu ứng mở hai cánh giấy |
| `assets/js/gift-scenes.js` | Danh mục 10 cảnh quà, bộ dựng dùng chung, trạng thái mở/hoàn chỉnh/đọc và vòng đời xem trước |
| `assets/js/gift-art-a.js`, `assets/js/gift-art-b.js`, `assets/js/gift-art-c.js` | SVG và tạo hình riêng của các cảnh quà mới |
| `assets/css/themes.css`, `assets/css/collection.css` | Không gian, chất liệu, chi tiết và bố cục điện thoại |
| `assets/css/gift-scenes.css`, `assets/css/gift-art-a.css`, `assets/css/gift-art-b.css`, `assets/css/gift-art-c.css` | Thư viện quà, bản xem trước và chuyển động từng cảnh |
| `assets/js/card-music.js` | Tìm tệp và trình phát duy nhất |
| `assets/music/catalog.json` | 36 mục ID, đường dẫn, tên hiển thị và nghệ sĩ |
| `assets/js/card-links.js` | Bộ nén LZ, bảng tiếng Việt v5, snapshot v4 và dữ liệu cũ; kèm giấy phép MIT |
| `assets/fonts/` | Font tự lưu và giấy phép OFL |

## Kiểm thử

Cần Python, Playwright và Chromium. Website không cần các công cụ này để chạy. Sau khi khởi động HTTP server:

```bash
BASE_URL=http://127.0.0.1:8000/ python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Các bộ kiểm thử hiện có gồm luồng tạo/gửi, Unicode và nội dung an toàn, nhạc thật qua HTTP, lỗi phát/clipboard, dữ liệu cũ, cảnh mở bằng bàn phím, hiệu ứng tắt/giảm chuyển động, chia sẻ đầy đủ và thiệp dài ở 360/390 px, tablet, desktop, xoay ngang. MP3 fixture dùng byte của các bản thu hiện có; không giả việc giải mã/phát thành công. Kiểm thử trường hợp trình duyệt chặn nhạc chủ động mô phỏng lỗi từ API.

Kiểm tra bằng Chromium với viewport mô phỏng không thay thế việc xác minh trên iPhone/Safari hay Android thật. Trường hợp `file://` có thể bị chính sách Chromium của môi trường chặn trước khi chạy ứng dụng. GitHub Pages chỉ cập nhật sau khi PR được merge và tác vụ triển khai thành công.

Bộ kiểm thử có thêm `tests/test_journey.py`: kiểm tra hai kiểu bó hoa với đủ 22 chủ đề, cảnh lớn còn hiện khi đọc, chuyển động thật, nhạc liên tục, lựa chọn có hình, lời nhắn trên hoa ở điện thoại, chia sẻ, xem lại, hủy và thay đổi chế độ giảm chuyển động giữa lúc mở. Bản lời tặng hoa có thêm sáu ca trong `tests/test_refinements.py`: không hiện thiệp trong bó hoa, 23 cành khớp tâm hoa trong lúc mọc/rung, cache quầng sáng và nhịp vẽ, xem thử khớp hiệu ứng thật, nút tạo thiệp nổi bật và liên kết nén tiếng Việt. **116 ca trình duyệt đạt, 1 ca `file://` bỏ qua do chính sách môi trường; 308 kiểm tra liên kết đạt.** Hai ca về kích thước bó hoa desktop và nút tạo thiệp điện thoại đã chạy lại đạt sau chỉnh bố cục. JavaScript qua kiểm tra cú pháp, HTML không trùng ID và đủ các đường dẫn script/CSS.

Phần chọn hoa/sao/bướm bay khi đọc có bản xem thử dùng cùng nét vẽ với hiệu ứng thật. Cảnh quà cũng có lớp đón hiệu ứng này. Khối **Tạo thiệp của bạn** nổi bật sau lời chúc; tạo mới xóa dữ liệu thiệp nhận và đưa về sáu nhóm người nhận.
