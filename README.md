# Lời thương · Thiệp 20/10

Website thiệp chúc mừng bằng HTML, CSS, JavaScript thuần. Thiệp mới đón người nhận bằng **bé B**: đôi mắt ánh sáng thức dậy, nói lời chúc riêng theo quan hệ rồi trao bó hoa lớn từ 2.450 hạt sáng (1.250 trên điện thoại) hoặc hoa mọc nở. Chạm cả bó hoa hoặc nút **Nhận hoa và mở lời chúc** để mở đúng thiệp đã chuẩn bị. Màn đầu không hiển thị tấm thiệp. Tạo lời chúc theo quan hệ, chọn thiết kế từ 41 chủ đề, nghe thử nhạc và chia sẻ nguyên tấm thiệp. Không cần backend, tài khoản, thư viện từ CDN hoặc bước build. Font tiếng Việt nằm trong dự án.

## Chạy và triển khai

Trong thư mục dự án:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Dùng trình duyệt trên máy chạy lệnh để mở cổng 8000. Có thể dùng Live Server. Cần phục vụ qua HTTP/HTTPS để kiểm tra tệp nhạc; `file://` không hỗ trợ đầy đủ. Khi gửi thiệp cho người khác, tạo liên kết từ địa chỉ website đã triển khai, không dùng địa chỉ máy cá nhân.

GitHub Pages: trong **Settings → Pages**, chọn **Deploy from a branch → main → /(root)**. Merge Pull Request từ `codex/20-10-premium` vào `main`, rồi chờ tác vụ Pages hoàn tất. Khi tải thủ công, phải đưa lên cả `index.html` và thư mục `assets/`; các module mới không còn nằm hết trong HTML. Giữ các MP3 cũ tại thư mục gốc. Các tệp JS/CSS vừa đổi có mã phiên bản trong URL để tránh dùng bản cache cũ sau khi Pages cập nhật.

## Tạo một món quà riêng

Để làm nhanh trên điện thoại: sau khi chọn người nhận, bấm **Tạo nhanh cùng bé B** ở đầu màn tạo thiệp. Bé B chỉ hỏi **tên người gửi → khung cảnh → lời nhắn riêng**. Có thể để trống rồi bấm **Tiếp** hoặc **Bỏ qua** để dùng mặc định theo đúng nhóm. Lời chúc ấm áp (lãng mạn cho người thương), tên người nhận đã điền, nhạc của nhóm và chữ ký theo tên người gửi xuất hiện ngay trong thiệp nháp. Cảnh đêm gợi ý hoa từ hạt sáng; cảnh sáng dùng hoa mọc nở.

Ở bước xem lại, chọn **Dùng thiệp này**; **Chỉnh thêm nhạc / chữ ký** mở tiếp các mục tùy chọn. **Cùng tạo thiệp** vẫn giữ luồng hỏi đầy đủ. Khi bắt đầu từ trò chuyện ở trang chủ, bé B hỏi thêm người nhận trước ba câu trên. Nhắn “giúp tạo thiệp nhanh cho bà” cũng mở đúng luồng tạo nhanh. Thiệp chính chỉ đổi khi áp dụng; vẫn có hoàn tác.

1. Chọn một trong đúng 6 nhóm: **Mẹ, Bà, Cô giáo, Chị/em gái, Bạn nữ/nhóm phụ nữ, Người thương**. Chọn chị hay em, bạn nữ hay nhóm phụ nữ ở phần quan hệ bên trong, thay vì thêm nhóm ngoài trang chủ. Mỗi quan hệ có ít nhất 6 lời gợi ý; sắc thái gồm ngắn gọn, ấm áp, vui vẻ, xúc động, thêm ngọt ngào và lãng mạn cho người thương.
2. Chọn cặp xưng hô hoặc sửa cả cách xưng và cách gọi. Khi đổi quan hệ, cặp xưng hô và lời mẫu cập nhật cùng nhau. Lời tự viết được giữ kèm lựa chọn **Giữ lời tôi viết / Dùng mẫu mới**.
3. Tên người gửi mặc định trống. Nếu không có tên, toàn bộ chữ ký được ẩn. Không lưu bản nháp vào bộ nhớ trình duyệt và không tự điền tên chủ dự án.
4. Khi vào màn tạo thiệp hoặc đổi người nhận, thư viện mặc định chỉ hiện **Gợi ý cho người nhận hiện tại**: chọn Bà thì chỉ thấy các mẫu hợp với bà. Chọn **Tất cả không gian** để xem đủ 41 mẫu, hoặc lọc theo **Rực rỡ, Dịu dàng, Lãng mạn, Thanh nhã, Kỳ ảo**. **Phối giúp tôi** chuyển giữa các tổ hợp được chọn theo người nhận; **Phối sẵn theo chủ đề** phục hồi phối cảnh mà vẫn giữ nội dung.
5. Xem thử cảnh mở đầy đủ trong hộp xem trước, hoặc nhảy đến **Bắt đầu / Món quà hoàn chỉnh / Đọc lời chúc**. Bản xem trước dùng cùng bộ dựng cảnh với thiệp thật, không phát nhạc; đóng hộp sẽ dừng và giải phóng cảnh.
6. Chỉnh chi tiết, chọn nhạc rồi mở thiệp thật. Người nhận chạm nút hoặc vật thể chính để mở; thao tác đó kích hoạt nhạc nếu bài có tệp và trình duyệt cho phép. Cảnh quà chạy đủ nhịp mở rồi tự chuyển sang lời chúc, vẫn giữ món quà bên cạnh để ngắm. Có nút bỏ qua, xem lại và **Giữ lại khoảnh khắc** để tạm dừng chuyển động.

Lời tự viết tối đa 3.000 đơn vị UTF-16, lời nhắn riêng và lời nhắn phụ tối đa 1.000; bộ đếm và giới hạn dùng cùng cách đếm với ô nhập HTML. Tên tối đa 100, cách xưng/cách gọi 30. Câu mở quà tối đa 160; cây lời nhắn cho phép tối đa 5 lời ngắn, mỗi lời tối đa 160. Các lời trên hoa hoàn toàn tùy chọn: để trống thì chỉ có hoa trang trí, không tự sinh kỷ niệm. Nội dung nhập được chuẩn hóa Unicode NFC và hiển thị bằng `textContent`.

## Nhân vật mang quà đến

Trong **Màn chào đón**, chọn **bé B tặng hoa** (mặc định cho thiệp mới) hoặc **Mở thiệp trực tiếp**. Chọn trực tiếp sẽ vào cảnh chủ đề, không có đoạn bé B. Các lựa chọn bó hoa độc lập vẫn dùng được khi không muốn nhân vật.

**Tên người đưa quà** cho phép đặt tên riêng tối đa 30 đơn vị UTF-16, ví dụ “Mây” hoặc “Bông”; bỏ trống dùng “bé B”. Tên cập nhật trong nhãn, lời thoại, mô tả cho trình đọc màn hình và bản xem trước, được chuẩn hóa NFC và hiển thị như văn bản. Không đổi tên người gửi hoặc người nhận.

Nhân vật là người đưa quà: mắt ngủ, thức dậy, tò mò, vui, ngại rồi nhìn về bó hoa. Lời thoại thay đổi theo Mẹ, Bà, Cô giáo, Chị/em gái, Bạn nữ/nhóm phụ nữ và Người thương; dùng đúng cách gọi, số ít/số nhiều và tên người nhận. Nếu có tên người gửi, bé B nhắc người đó nhờ chuyển quà; không có tên thì dùng câu trung tính, không tự điền tên chủ dự án. Không dùng đại từ của người gửi làm vai của bé B.

Lời dẫn gợi ý có 4 câu chính; lời tự soạn dùng số câu của bạn. Mỗi câu giữ tối thiểu 4,8 giây; câu dài được tăng thời gian theo số từ và số ký tự, tối đa 16 giây/câu. Lời dẫn mặc định thường khoảng 23–30 giây trước khi trao hoa; tên/lời thêm dài có thể cần nhiều thời gian hơn. Hoa giữ chờ người nhận. Có **Mở thiệp ngay** ở mọi nhịp. Nhân vật và bó hoa nằm trong cùng một bầu trời: cạnh nhau trên máy tính, nối dọc trên điện thoại. Nhận hoa làm nhân vật vui lên, bó hoa chuyển cảnh 0,85–1,25 giây rồi **chạy đúng hiệu ứng mở của chủ đề đã chọn** (khoảng 2,8 giây cho các chủ đề cũ, 4,2 giây cho cảnh quà). Sau đó lời chúc tự mở, không cần bấm lần nữa. **Bỏ qua hiệu ứng** mở ngay phần đọc. Khi không dùng nhân vật, các cảnh quà vẫn giữ thao tác chọn đọc như trước.

Người nhận có **Câu trước**, **Dừng để đọc**, **Đọc tiếp** và bộ đếm số câu (mẫu mặc định 1/4; lời tự viết dùng đúng số câu đã soạn). **Dừng để đọc** hiện trọn câu rồi giữ vô thời hạn; nhạc vẫn tiếp tục. **Tự chuyển tiếp** tiếp tục từ thời gian còn lại và không làm chữ biến mất để chạy hiệu ứng lại. **Câu trước** giữ chế độ tự đọc để câu không tự trôi đi. Ở câu cuối, **Đón bó hoa** trao đúng một bó hoa và đưa tiêu điểm bàn phím sang nút nhận hoa. Không hiện thanh thời gian; bộ đếm chỉ cho biết vị trí câu. Ẩn/hiện tab không tự hủy lựa chọn dừng của người đọc. Các nút này chỉ điều khiển lần xem hiện tại, không thêm dữ liệu vào URL.

Có thể thêm một câu tối đa 160 ký tự trong lời dẫn; **Xem bé B → hoa → thiệp** dùng chính nội dung, tên, xưng hô, chủ đề, kiểu chữ, chữ ký và bài nhạc đang chọn. Cấu hình lưu ở `design.welcome`, `design.welcomeText`, `design.welcomeName`, `design.welcomeMusic`; chỉ thêm ở cuối các trường URL cũ. Liên kết trước đây không có tên nhân vật vẫn dùng bé B; không có cấu hình nhạc chào thì giữ hành vi âm thanh cũ.

Nhân vật được dựng bằng CSS/SVG và một bộ hẹn giờ theo các nhịp, không tải tài nguyên từ trang tham khảo, không nhúng trang bằng iframe. Tạm dừng thời gian và chuyển động khi ẩn tab; hủy hẹn giờ khi đọc, quay lại sửa hoặc rời trang. Giảm/tắt chuyển động hiện ngay bé B cùng hoa hoàn chỉnh, lời chúc nhóm và câu tùy chỉnh. Nếu module nhân vật không tải được, ứng dụng chuyển sang màn bó hoa vốn có. Nhân vật có mắt nhìn quanh, dõi theo con trỏ/chạm trong giới hạn nhỏ, nháy mắt đôi, ánh sáng thức dậy, chuyển động miệng theo nhịp chữ, má hồng và hạt sáng khi trao hoa. Chạm hoặc nhấn Enter vào nhân vật để chào lại: nghiêng đầu, nháy mắt và lóe sao, không khởi động lại nhạc đang phát. Chữ hiện theo từng từ bằng CSS với nhịp mềm hơn; khuôn miệng chuyển động chậm cùng câu. Không tạo bộ hẹn giờ riêng cho mỗi ký tự, toàn bộ lời dẫn chỉ giữ một bộ hẹn giờ chờ. Giảm/tắt chuyển động áp dụng cả lớp ánh sáng giả phần tử và phản hồi chạm.

**Nhạc hộp nhạc cho màn chào** bật mặc định cho thiệp mới, có thể tắt trong Màn chào đón. Bản không lời 24 giây được tạo riêng và lưu tại `assets/music/loichao.mp3`. Nhạc thử phát khi màn chào bắt đầu; nếu trình duyệt chặn, nút **Bật nhạc chào** hoặc chạm nhân vật sẽ phát trong thao tác hợp lệ. Khi nhận hoa/bỏ qua, cùng phần tử audio đổi sang đúng bài nhạc của thiệp; không phát hai nguồn chồng nhau. Nhạc của thiệp tiếp tục qua cảnh chủ đề và vào phần đọc, không phát lại từ đầu. Tắt nhạc được tôn trọng khi nhận hoa hoặc xem lại. Nhạc chào tạm dừng khi ẩn tab và tiếp tục từ vị trí cũ; thoát trang hủy ý định phát còn chờ. Thiếu/lỗi tệp nhạc chào không làm kẹt nhân vật hoặc đánh dấu nhầm bài thiệp bị thiếu.

## Bó hoa lớn khi nhận thiệp

Trong màn bé B, chủ đề thiên nhiên gợi ý **Hoa mọc lên và bung nở**, chủ đề đêm/vũ trụ gợi ý **Bó hoa từ ngàn hạt sáng**. Người gửi có thể chọn lại cách hoa xuất hiện. Có thể chọn **Bó hoa mọc lên và bung nở** hoặc **Dùng cảnh mở trong thư viện**. Hai kiểu bó hoa chỉ hiện hoa và lời tặng 20/10, không đặt tấm thiệp ở giữa bó. Khi không dùng bé B, nhấn **Nhận hoa và mở lời chúc**, cả bó hoa rung nhẹ như một khối rồi **cảnh chủ đề đã chọn tiếp tục mở đầy đủ**: đảo hoa, cây lời nhắn, ngân hà hoặc một trong 41 chủ đề. Nhạc bắt đầu từ thao tác chạm ban đầu và tiếp tục xuyên suốt, không phát lại khi chuyển cảnh. Cả 29 cảnh quà có trạng thái hoàn chỉnh và tự chuyển sang phần đọc sau nhịp mở; người nhận có thể bỏ qua hoặc xem lại.

Khi đọc, hoa/sao/bướm đã chọn tiếp tục bay nhẹ ở hai mép ngoài để không che chữ, kể cả sau khi đợt hiệu ứng mở đầu kết thúc. Cảnh chủ đề hiện lớn cạnh lời chúc trên desktop, phía trên thiệp trên điện thoại; cây/hoa/quỹ đạo vẫn ở lại, giữ chuyển động nhẹ và tương tác. Không giấu cảnh trong một dấu nhỏ trên giấy hay chỉ đặt tận cuối trang. Phần lựa chọn màn đón có hình minh họa, mô tả chuỗi mở, hình chủ đề cập nhật trực tiếp và nút **Xem trọn luồng này** cho cả ba lựa chọn. Chế độ giảm/tắt chuyển động vẫn hiện đầy đủ món quà tĩnh.

Phần đón bó hoa dùng canvas điểm sáng định vị theo cánh/nhụy/lá/cành và hình SVG 23 đóa hoa, giấy gói, nơ. Cành bắt đầu tại tâm mỗi hoa; cành, hoa, giấy gói và điểm sáng cùng chuyển động, không tách hai nửa. Giới hạn DPR 1,5 và giảm mật độ trên thiết bị yếu. Nhịp vẽ hạt sáng tối đa 30 lần/giây lúc xuất hiện, 20 khi đã ổn định (24/12 trên máy yếu); SVG rung nhẹ vẫn dùng CSS. Quầng sáng được vẽ sẵn theo màu và tái sử dụng, không tạo radial gradient trong mỗi khung hình. Hoa có bốn tầng cánh và nhụy chi tiết, mở lần lượt quanh đúng tâm cành. Không dùng filter trên từng bông hoa. Cành được vẽ từ gốc lên; giấy gói mở mềm, nơ vào sau. Kiểu hạt sáng hội tụ theo đường cong, thêm vệt sao và quầng sáng ngắn khi bó hoa thành hình; không dùng một lớp ảnh quét từ dưới lên. Dừng vòng vẽ khi ẩn, chuyển màn hoặc bật giảm chuyển động; bản tĩnh vẫn có đầy đủ bó hoa. Liên kết lưu `design.arrival`; liên kết cũ chưa có trường này giữ cảnh đã chọn.

Nhạc lúc làm thiệp lấy **ngẫu nhiên từ những bài có sẵn của đúng nhóm người nhận**, trong sáu vị trí `0me.mp3`–`5me.mp3`, `0ba.mp3`–`5ba.mp3`, `0co.mp3`–`5co.mp3`, `0chi.mp3`–`5chi.mp3`, `0nu.mp3`–`5nu.mp3`, `0yeu.mp3`–`5yeu.mp3`. Không cần `nhac.mp3`. Chạm **Bật nhạc làm thiệp** để nghe; **Đổi bài ngẫu nhiên** tránh lặp ngay bài đang nghe nếu có bài khác. Hết một bài sẽ tự bốc bài tiếp cùng nhóm. Nhạc lúc viết có âm lượng riêng, không đổi bài/âm lượng được gửi trong thiệp. Tạm dừng/hủy trong lúc tìm nhạc không bị phát lại bởi kết quả đến muộn; thiếu nhạc được báo theo đúng nhóm. Tệp cũ vẫn được giữ và dùng như dự phòng theo danh mục đã có.

**Đổi nhóm ngay tại nhạc cho người nhận:** bộ chọn **Chọn nhóm nhạc cho tấm thiệp** mặc định theo người nhận, nhưng có thể chọn nhạc cho bà/cô/người thương trong khi đang làm thiệp cho mẹ. Người nhận, lời chúc và cách xưng hô không đổi. Nhạc lúc viết vẫn ngẫu nhiên theo người nhận của thiệp; đổi nhóm nghe gửi không làm đổi nhóm nhạc lúc viết. `design.musicGroup` chỉ lưu khi chọn nhóm riêng; link gửi giữ đúng nhóm, bài và âm lượng. Chọn lại **Theo người nhận** để trở về nhạc của nhóm thiệp.

## 41 chủ đề và cảnh mở quà

Ba mẫu dành cho cô bổ sung vào thư viện, vẫn giữ toàn bộ 38 mẫu trước:

| Mẫu | Cảnh mở và lúc đọc |
| --- | --- |
| Cây hoa tri ân | Cây vươn cành, tán hoa nở lần lượt; chạm năm bông có số để mở lời nhắn. Có sẵn năm lời chúc chung cho cô, sửa hoặc xóa được trong Chi tiết; đổi mẫu không ghi đè lời đã sửa. |
| Trang sách biết ơn | Hai trang xoay mở, khu vườn giấy bật lên từ gáy sách, giấy và hạt sáng bay lên; sách và hoa vẫn ở lại cạnh thiệp. |
| Bảng phấn ngân hà | Nét phấn vẽ thành năm chòm hoa trên bảng đêm; ánh sao chuyển động nhẹ quanh lời tri ân. |

Nhóm gợi ý cho cô cũng có Cây hoa mang lời nhắn và Cuốn sách cổ tích cũ. Sáu cảnh kể chuyện trước thêm nét sáng, vòng sáng và cánh hoa trong khoảnh khắc mở; chuyển động mạnh chỉ chạy lúc mở, sau đó về nhịp nhẹ. SVG dùng lại các chi tiết, không thêm vòng vẽ JavaScript.

Hai mươi chín cảnh quà có trạng thái bắt đầu, chuyển đổi, quà hoàn chỉnh và đọc lời chúc. Hình đại diện và bản xem trước lấy từ chính đồ họa dùng khi nhận thiệp.

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

Sáu mẫu mới đều có hình xem trước, cảnh mở và chuyển động nhẹ khi đọc:

| Mẫu | Cảnh mở |
| --- | --- |
| Vườn hoa trong lồng kính | Nắp kính nâng lên, từng nhành hoa mở dưới ánh sáng mềm |
| Hiên hoa tử đằng | Hai rèm hoa tím hé, bức thư hiện dưới vòm hoa |
| Trăng ôm hồ sen | Trăng lên, những cánh sen ngọc lần lượt mở trên mặt hồ |
| Bưu thiếp ban mai | Cửa hộp thư hé, hướng dương và lá thư đón nắng |
| Cánh đồng oải hương | Những luống hoa tím xuất hiện, thư được nâng giữa nắng mật ong |
| Khu vườn trái tim | Hai cánh tim mở, hoa và lời thương xuất hiện ở giữa |

Tất cả dùng SVG trong dự án, không thêm vòng lặp JavaScript hay âm thanh riêng. Các nhành hoa chuyển động cùng cành; thư viện, phần đánh dấu trên giấy và cảnh ẩn tạm dừng chuyển động. Tôn trọng giảm/tắt chuyển động và trạng thái giữ khoảnh khắc.

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

## Ký tên lên thiệp

Trong phần tạo thiệp, mục **Ký một chút thương** có tên/lời ký riêng tối đa 80 đơn vị UTF-16, bốn kiểu **Nét bút mềm / Thanh lịch / Gọn gàng / Dấu riêng** và khung ký tay tùy chọn. Để trống lời ký thì dùng tên người gửi; không có tên nhưng có nét ký vẫn hiện chữ ký tay. Không tự thêm tên mặc định. Tên người gửi dùng trong lời dẫn của nhân vật giữ độc lập với lời ký trên giấy.

Ký bằng ngón tay, bút hoặc chuột. Có **Hoàn tác nét** và **Ký lại**; thay đổi chủ đề hoặc **Phối sẵn theo chủ đề** giữ chữ ký. **Hiện lời ký và chữ ký** ẩn/hiện cả lời ký và nét bút. Tạo thiệp mới xóa chữ ký cũ. Người dùng bàn phím có thể nhập lời ký thay cho ký tay.

Chữ ký đi cùng liên kết, không cần gửi ảnh lên máy chủ. Nét bút được làm gọn và lưu bằng tọa độ số trong khung 600 × 180, tối đa 16 nét/400 điểm và 1.215 ký tự trước nén. Không nhận SVG, ảnh, đường dẫn hoặc HTML từ dữ liệu chữ ký. Phần đọc dùng đường nét SVG dựng từ các tọa độ đã kiểm tra, có hiệu ứng viết nhẹ và tắt khi giảm chuyển động/in thiệp. Trường `signatureText`, `signatureInk`, `signatureStyle` thêm sau các trường liên kết cũ; liên kết không có các trường này giữ chữ ký tên người gửi như trước.

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

Đã đồng bộ **11 tệp chuẩn** bạn tải lên `main`: 6 tệp cho Mẹ (`0me.mp3` đến `5me.mp3`) và 5 tệp cho Bà (`0ba.mp3` đến `4ba.mp3`) trong `assets/music/`. Các tệp đều được kiểm tra là MP3 hợp lệ. Hai vị trí khác nghe được bằng tệp cũ: `nu:0` → `music_under.mp3`, `nu:1` → `music_over.mp3`. Tổng cộng 13/36 vị trí có nguồn âm thanh; **23 vị trí chưa có bản thu**: `5ba`, `0–5co`, `0–5chi`, `2–5nu`, `0–5yeu` (đều đuôi `.mp3`). Còn 25 đường dẫn chuẩn chưa có tệp vật lý. Giữ nguyên mọi tệp cũ và các tệp `.MP3` bạn đã tải ở thư mục gốc; website ưu tiên bản chữ thường trong `assets/music/`.

Xem [MUSIC.md](MUSIC.md) để có danh sách thiếu, bảng chuyển tên và nhạc riêng khi tạo thiệp. Tên bài/nghệ sĩ trong `assets/music/catalog.json` chỉ nên điền sau khi xác định đúng bản thu.

Chỉ có một phần tử audio. Trình phát kiểm tra HEAD cho nhóm được chọn, tải metadata của bài được chọn, không tải trước 36 bài. Có nghe thử, phát/dừng, trước/sau, âm lượng và kiểm tra lại tệp. Không tự phát khi bắt đầu nhập liệu hoặc xem trước cảnh; thiếu nhạc không ngăn mở thiệp. Cảnh hộp nhạc cũng dùng bài người gửi chọn, không tạo nhạc riêng phát chồng. Lựa chọn tắt nhạc được giữ khi xem lại. Nếu hệ điều hành không cho điều chỉnh âm lượng qua web, dùng nút âm lượng điện thoại.


## Tự viết lời cho người đưa quà

Trong **Màn chào đón → Bạn muốn nhân vật nói gì?**, chọn **Tự viết và sắp xếp từng câu**. Lời gợi ý theo nhóm được điền vào làm điểm bắt đầu; bạn sửa toàn bộ, thêm/xóa hoặc đưa câu lên/xuống. Viết 2–8 câu, mỗi câu 160 ký tự. Câu cuối hiện khi trao hoa; các câu trước hiện lần lượt với biểu cảm và nhịp đọc theo độ dài. Ô trống được báo trước khi xem/gửi, không tự bỏ câu. Đổi tên nhân vật sau khi tự viết không sửa các chữ bạn đã viết.

Đây là lời thoại bằng chữ cùng biểu cảm và nhạc hộp nhạc, không phải giọng đọc. Nhạc chào tiếp tục dùng trình phát chung; nhận hoa chuyển sang nhạc thiệp đã chọn. Lời thoại tự soạn được lưu nguyên văn trong URL, độc lập lời chúc và chữ ký trên giấy. Giảm/tắt chuyển động hiển thị đủ các câu ngay cùng bó hoa; các nút đọc chậm, ẩn tab, bỏ qua và xem lại vẫn dọn đúng bộ hẹn giờ.

Bé B ở cố định góc phải dưới màn trang chủ và tạo thiệp. Mở nhân vật để hỏi về hành trình mở liên kết, nhóm người nhận/xưng hô, mẫu/cảnh mở, giấy/chữ/hiệu ứng, nhạc làm thiệp/nhạc chào/nhạc gửi, chữ ký, lời nhắn trên hoa, chia sẻ và quyền riêng tư. Nút **Đến mục này** thu gọn trò chuyện, mở phần tùy chỉnh đang đóng và đưa tới đúng điều khiển. Đây là hướng dẫn cục bộ theo các tính năng của trang, không phải mô hình AI trực tuyến; không gửi câu hỏi đi. Lịch sử chỉ giữ tối đa 12 tin trong lần xem.

Nhắn **“Tôi cần web cho mẹ, giúp tôi với”**, **“Tạo thiệp cho cô”** hoặc bấm **Cùng tạo thiệp**: bé B dùng ngay nhóm người nhận đã chọn trên màn tạo thiệp (ở trang chủ mới hỏi chọn nhóm), rồi hỏi tên hai bên, mẫu/cảm xúc, lời chúc, lời thêm, kiểu hoa, bài nhạc và chữ ký. Mỗi câu hỏi có dòng ví dụ nhỏ, cách gọi và ví dụ ký tên theo đúng nhóm. Bước nhạc hiện sáu bài của nhóm đó; **Chọn nhóm nhạc khác** mới mở các nhóm còn lại. Có nút trả lời nhanh, bỏ qua, quay lại, hủy. Phía trên trò chuyện có thiệp nháp và hình cảnh đã chọn; tên, lời chúc và chữ ký cập nhật ngay khi nhập, dùng cùng hàm tạo nội dung với thiệp thật. Có **Đọc đủ lời trên thiệp nháp** để kiểm tra toàn bộ chữ. Nội dung vẫn là bản nháp cho tới khi bấm **Áp dụng bản nháp** ở bước xem lại; sau đó có **Xem thiệp vừa tạo** và **Hoàn tác bản nháp** (phục hồi cả chữ ký vẽ của thiệp trước). Bé B tạo thiệp trong ứng dụng này; không tạo website tùy ý hoặc tự gửi link ra ngoài. Câu hỏi về cách dùng trong lúc đang trả lời được giải thích mà không chuyển bước. Tự viết lời chúc qua trò chuyện tối đa 1.000 ký tự; ô soạn chính vẫn cho 3.000.

Khi chưa mở trợ giúp và không đang nhập/vẽ, bé B tự chào sau khoảng 2,4 giây rảnh; kính đen và câu tự khen xuất hiện sau khoảng 11 giây, lấy điện thoại tự sướng sau khoảng 19 giây và tung bóng rơi trúng đầu sau khoảng 28 giây nếu không có thao tác mới. Có tối đa sáu hoạt cảnh nhỏ mỗi lần xem. Nút **Bé B làm trò** cho chọn kính đen, tự sướng, tung bóng hoặc thả tim ngay, không cần chờ. Kính đen nói “Thấy tớ ngầu hông? 😎”. Khi tự sướng, bé B lấy điện thoại tím, nghiêng đầu cười và có hai lần lóe sáng nhỏ; đây là hoạt cảnh SVG, không truy cập camera hay chụp ảnh người dùng. Tối đa bốn lời nhắc mỗi lần tải trang, có nút tắt; không tự mở khung, lấy tiêu điểm hoặc phát nhạc. Sáu biểu cảm, kính đen có tròng đặc, bóng bật nhẹ và sao quanh đầu tôn trọng giảm chuyển động. Nhân vật ẩn và hủy bộ hẹn giờ khi nhận hoa/đọc thiệp hoặc ẩn tab. Khung hội thoại và nút trả lời nằm trên vùng bàn phím điện thoại; đóng bằng × hoặc Escape.

Bốn cảnh được bổ sung ở bản trước: **Bồ công anh gửi ước**, **Tách trà nở hoa**, **Lọ thư giữa biển sao**, **Hạc giấy chở ngàn sao**. Mỗi cảnh có bố cục SVG, chuyển động mở và chuyển động nhẹ lúc đọc riêng. Thêm ba lựa chọn **Đom đóm**, **Trái tim**, **Bọt ngọc**; tất cả bảy lựa chọn (kể cả tĩnh) dùng được cho mọi chủ đề. Thư viện tự tính số mẫu và đặt bốn mẫu mới lên đầu.


## Gợi ý theo người nhận và sáu cảnh có nhân vật

Thư viện giữ toàn bộ 32 mẫu trước, thêm **Vòng tay của mẹ, Chiều trà cùng bà, Bài giảng nở hoa, Xích đu hai chị em, Hẹn nhau dưới tán hoa, Điệu valse của hai ta**. Các nhân vật được vẽ bằng SVG trong dự án; mỗi cảnh có chuyển động mở và chuyển động nhẹ bên lời chúc, không dùng video nặng hoặc ảnh tải từ bên ngoài.

Bộ lọc có **Gợi ý cho người nhận hiện tại** và sáu nhóm **Cho Mẹ / Bà / Cô giáo / Chị-em gái / Bạn nữ-nhóm phụ nữ / Người thương**, bên cạnh năm cảm xúc cũ. Trong Tất cả, mẫu hợp với người đang nhận được đưa lên đầu và gắn nhãn. Mọi mẫu trước đây vẫn nằm trong Tất cả và ít nhất một nhóm gợi ý. Lọc chỉ sắp xếp/ẩn-hiện mẫu, không thay người nhận, lời tự viết, chữ ký hoặc nhạc. Nút gợi ý thiết kế cũng dùng cùng danh sách theo người nhận.

## Liên kết giữ đúng tấm thiệp

Định dạng `#c=` tự chọn bản ngắn nhất trong v4/v5/v6. V6 dùng bảng giá trị thiết kế và 25 đoạn văn cố định, thay thế chính xác trước khi nén; dữ liệu không nằm trong bảng vẫn được lưu nguyên văn. Bảng v6 không lấy từ danh sách lời gợi ý đang thay đổi, nên các tấm thiệp đã gửi giữ nguyên chữ. V4/v5 cũ tiếp tục đọc được. V5 dùng bảng ký tự/cụm từ tiếng Việt cố định trước khi nén LZ; Latin-1 được escape để giữ chính xác văn bản đa ngôn ngữ, có giới hạn trong lúc mở rộng. API giải mã trả về cùng snapshot v4; v1/v2/v3/v4 cũ vẫn đọc nguyên vẹn. Liên kết lưu nguyên văn lời chúc đã render, cặp xưng hô, người nhận/gửi, lời nhắn, mọi lựa chọn thiết kế, ID cảnh quà, câu mở quà, các lời nhắn trên hoa, nhạc và âm lượng. Nhóm nhạc độc lập và ba ID cảnh mới được nối vào cuối bảng lựa chọn; bảng mặc định v6 giữ nguyên để link cũ không đổi nghĩa. Thiệp dùng nhóm nhạc riêng tự chọn bộ mã v4/v5 tương thích. Các trường mới được thêm ở cuối dữ liệu v4 để thiệp v4 trước đó vẫn đọc được. Thay đổi danh sách mẫu sau này không làm lời chúc đã gửi đổi theo. Liên kết vẫn chứa nội dung, không phải một mã tra cứu trên máy chủ; độ dài phụ thuộc lời riêng và nét ký. Với link mẫu trong yêu cầu này, fragment giảm từ 288 xuống 102 ký tự và giải mã ra cùng dữ liệu. Có phần giải thích ở màn chia sẻ: muốn một mã rất ngắn có thể tự dán link vào TinyURL. Đây là dịch vụ bên ngoài và sẽ nhận link thiệp khi người dùng dán vào; website không tự tải thiệp lên dịch vụ này. Không dùng khóa localStorage làm link giả: thiệp mở được trên máy khác chỉ từ URL.

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
| `assets/js/bebe-welcome.js`, `assets/css/bebe-welcome.css` | Nhân vật bé B, lời thoại sáu nhóm, nhịp dẫn, biểu cảm và dọn bộ hẹn giờ |
| `assets/js/bouquet-arrival.js`, `assets/css/bouquet-arrival.css` | Bó hoa lớn, lời tặng 20/10, cành và hoa chuyển động liền nhau, vòng đời canvas |
| `assets/css/reception.css` | Màn tạo thiệp, nhạc riêng và hiệu ứng mở hai cánh giấy |
| `assets/js/gift-scenes.js` | Danh mục 29 cảnh quà, bộ dựng dùng chung, trạng thái mở/hoàn chỉnh/đọc và vòng đời xem trước |
| `assets/js/gift-art-a.js`, `assets/js/gift-art-b.js`, `assets/js/gift-art-c.js`, `assets/js/gift-art-d.js` | SVG và tạo hình riêng của các cảnh quà mới |
| `assets/css/themes.css`, `assets/css/collection.css` | Không gian, chất liệu, chi tiết và bố cục điện thoại |
| `assets/css/gift-scenes.css`, `assets/css/gift-art-a.css`, `assets/css/gift-art-b.css`, `assets/css/gift-art-c.css`, `assets/css/gift-art-d.css` | Thư viện quà, bản xem trước và chuyển động từng cảnh |
| `assets/js/card-signature.js`, `assets/css/card-signature.css` | Khung ký tay, định dạng tọa độ có giới hạn, chữ ký trên giấy và kiểu lời ký |
| `assets/js/card-music.js` | Tìm tệp và trình phát duy nhất |
| `assets/music/catalog.json` | 36 mục ID, đường dẫn, tên hiển thị và nghệ sĩ |
| `assets/js/bebe-assistant.js` | Hướng dẫn cục bộ, bản nháp qua hội thoại, lời chào chủ động và trò vui khi rảnh |
| `assets/js/gift-art-g.js`, `assets/css/gift-art-g.css` | Ba cảnh riêng cho cô: cây tri ân, sách bật vườn giấy và bảng phấn ngân hà |
| `assets/js/welcome-studio.js`, `assets/css/welcome-studio.css` | Soạn và sắp xếp lời thoại; bé B hướng dẫn độc lập trong màn tạo thiệp |
| `assets/js/theme-recommendations.js` | Gợi ý mẫu theo sáu nhóm, dùng chung trong bộ lọc và bé B |
| `assets/js/gift-art-f.js`, `assets/css/gift-art-f.css` | Sáu cảnh có nhân vật theo người nhận, mở/đọc cùng một đồ họa |
| `assets/js/gift-art-e.js`, `assets/css/gift-art-e.css` | Bốn cảnh quà mới, phần mở và phần chuyển động khi đọc |
| `assets/js/card-links.js` | Bộ nén LZ, bảng v5/v6, snapshot v4 và dữ liệu cũ; kèm giấy phép MIT |
| `assets/fonts/` | Font tự lưu và giấy phép OFL |

## Kiểm thử

Cần Python, Playwright và Chromium. Website không cần các công cụ này để chạy. Sau khi khởi động HTTP server:

```bash
BASE_URL=http://127.0.0.1:8000/ python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Các bộ kiểm thử hiện có gồm luồng tạo/gửi, Unicode và nội dung an toàn, nhạc thật qua HTTP, lỗi phát/clipboard, dữ liệu cũ, cảnh mở bằng bàn phím, hiệu ứng tắt/giảm chuyển động, chia sẻ đầy đủ và thiệp dài ở 360/390 px, tablet, desktop, xoay ngang. MP3 fixture dùng byte của các bản thu hiện có; không giả việc giải mã/phát thành công. Kiểm thử trường hợp trình duyệt chặn nhạc chủ động mô phỏng lỗi từ API.

Kiểm tra bằng Chromium với viewport mô phỏng không thay thế việc xác minh trên iPhone/Safari hay Android thật. Trường hợp `file://` có thể bị chính sách Chromium của môi trường chặn trước khi chạy ứng dụng. GitHub Pages chỉ cập nhật sau khi PR được merge và tác vụ triển khai thành công.

Đợt khôi phục nhịp xuất hiện đã chạy **26 ca trình duyệt đạt** trong các bộ `test_arrival.py`, `test_journey.py`, `test_refinements.py`: hai kiểu bó hoa và 22 chủ đề, cánh hoa mở khác thời điểm, tâm cánh khớp đầu cành trong lúc nở/rung, nhạc và chia sẻ, cache quầng sáng, nhịp vẽ, giảm/tắt chuyển động và xem lại. Bộ kiểm tra liên kết riêng nằm ở `tests/test_links.js`. JavaScript qua kiểm tra cú pháp và `git diff --check` đạt. Có video ghi lại trực tiếp bằng Chromium ở viewport 390 px để kiểm tra nhịp nở, không chỉ ảnh tĩnh.

Phần chọn hoa/sao/bướm bay khi đọc có bản xem thử dùng cùng nét vẽ với hiệu ứng thật. Cảnh quà cũng có lớp đón hiệu ứng này. Khối **Tạo thiệp của bạn** nổi bật sau lời chúc; tạo mới xóa dữ liệu thiệp nhận và đưa về sáu nhóm người nhận.

Bản bé B có bộ `tests/test_bebe.py` kiểm tra nhịp dẫn thật, sáu nhóm/biến thể, dữ liệu chia sẻ, nhạc liên tục, bỏ qua, bàn phím, chống mở lặp, ẩn/hiện tab, khôi phục trang, giảm chuyển động, tên dài và fallback khi module nhân vật thiếu. Các bộ hồi quy cũ chọn rõ màn không dùng bé B để tiếp tục kiểm tra từng cảnh gốc. Bản tích hợp bé B ban đầu: **129 ca trình duyệt đạt, 1 ca `file://` bị bỏ qua do chính sách Chromium**, gồm đủ 12 ca bé B và hồi quy các bộ browser, upgrade, collection, wow, gifts, arrival, journey, refinements. Ca bố cục bó hoa được chạy lại đạt sau khi chỉnh vùng nút cho điện thoại. Bộ liên kết đạt **331/331** kiểm tra. Kiểm tra cú pháp JavaScript, đường dẫn tài nguyên, ID HTML và `git diff --check` đều đạt. Video ghi trực tiếp ở viewport điện thoại 390 × 844 thể hiện trọn luồng bé B → hoa → thiệp.

Đợt bổ sung tên nhân vật và nhạc chào: **59 ca trình duyệt đạt, 1 ca `file://` bỏ qua do chính sách Chromium**, trong `test_welcome_music.py`, `test_bebe.py`, `test_upgrade.py`, `test_browser.py`; **355 kiểm tra liên kết đạt**. Các ca nhạc dùng MP3 thật để xác minh giải mã/phát, chuyển nguồn, tắt nhạc, xem lại, ẩn tab; chỉ mô phỏng lỗi khi kiểm tra trình duyệt chặn tự phát. Kiểm tra bố cục và thao tác bàn phím ở 360/390/1440 px, tên có dấu/emoji/ký tự HTML, dữ liệu chia sẻ và liên kết cũ. Có video ghi trực tiếp khung hình và âm thanh Chromium ở 390 × 844.

Bản sửa luồng hiệu ứng kiểm tra riêng bằng `tests/test_welcome_effects.py`: cả 22 chủ đề đều phải đi qua renderer mở thật sau bé B và hoa, rồi giữ đúng chủ đề khi đọc. Bản xem trước và thiệp nhận dùng chung luồng; bỏ qua vẫn đọc ngay, nhạc không phát lại, giảm/tắt chuyển động không bị chờ cảnh.

Kiểm chứng bản sửa hiệu ứng: **41 ca trình duyệt đạt** trong `test_welcome_effects.py`, `test_bebe.py`, `test_welcome_music.py`, `test_journey.py`, `test_refinements.py`, gồm kiểm tra cả 22 chủ đề với nhân vật và 22 chủ đề cho hai kiểu bó hoa độc lập. Ca sao khi đọc được chạy lại với chủ đề hỗ trợ sao; nút nhạc/bỏ qua được tăng vùng chạm lên 46 px rồi chạy lại kiểm tra điện thoại. **355 kiểm tra liên kết đạt**, cú pháp JavaScript, ID/tài nguyên HTML và `git diff --check` đạt. Video 390 × 844 ghi cả âm thanh và chuỗi nhân vật → hoa → cây hoa mở thật → thiệp có hiệu ứng tiếp tục.

Bản điều chỉnh nhịp đọc thêm `tests/test_welcome_reading.py`: giữ câu qua mốc 3 giây, dừng hơn thời lượng tự chuyển, đọc lại/tiếp bằng bàn phím, tăng thời gian cho lời thêm dài, giữ dừng qua ẩn tab, chuyển tiêu điểm khi đón hoa, tôn trọng giảm chuyển động và dọn hẹn giờ khi bỏ qua/xem lại/rời trang.

Kiểm chứng bản nhịp đọc: **33 ca trình duyệt đạt** (7 reading, 12 bé B, 8 nhạc chào, 6 hiệu ứng mở với cả 22 chủ đề); **355 kiểm tra liên kết đạt**. Cú pháp JavaScript, ID/tài nguyên HTML và `git diff --check` đạt. Video ghi trực tiếp cả khung hình và âm thanh ở 390 × 844, minh họa dừng/đọc tiếp rồi đón hoa, mở cảnh cây hoa và đọc thiệp.

Bản làm gọn nhân vật bỏ thanh thời gian và hai nét tay rời dưới mắt; vẫn giữ nhịp đọc chậm và các nút đọc trước/dừng/tiếp. Thêm tám đốm sáng trôi chậm và ánh sáng thở sau mắt, không thêm bộ hẹn giờ hoặc vòng lặp vẽ. Bộ `test_signature_gardens.py` kiểm tra chữ ký nhập/ký tay/chia sẻ/hoàn tác/hủy nét/cảm ứng, dữ liệu cũ và sáu cảnh mở mới với nhạc liên tục.

Kiểm chứng bản mẫu mới/chữ ký: **61 ca trình duyệt đạt** trong collection (20), gifts (17), welcome_reading (7), welcome_music (8), signature_gardens (9); **406 kiểm tra liên kết và định dạng nét ký đạt**. Có ca cảm ứng qua Chromium, lời ký dài ở 360/390 px, hoàn tác/hủy nét/rời trang, giữ nguyên dữ liệu khi chia sẻ, cả 16 cảnh quà và giảm chuyển động. Ca thư viện được chạy lại sau khi đưa sáu mẫu mới lên đầu; các trường hợp chữ ký dài và hủy nét khi rời trang được kiểm tra riêng. Cú pháp JavaScript, ID/tài nguyên HTML và `git diff --check` đạt. Chưa thay thế kiểm tra trên điện thoại/Safari thật.


Kiểm thử phần lời thoại/chủ đề mới: `tests/test_welcome_studio.py` bao gồm thứ tự 2–8 câu, đổi/xóa câu, nhịp đọc, dừng/đọc lại, nội dung thật trên trình duyệt tách bộ nhớ, fallback khi module nhân vật không tải được, chữ an toàn, điện thoại 360/390 px và máy tính. Các bộ collection/gifts/welcome_effects đã cập nhật để kiểm tra đủ 32 chủ đề và 20 cảnh quà. Bộ `test_links.js` kiểm tra tương thích cũ, bảng v6, đa ngôn ngữ/ký tự điều khiển, lời thoại, giới hạn và dữ liệu hỏng. Ảnh thực tế từ Chromium được kiểm tra thêm để sửa tương phản chữ/nút ở các cảnh đêm.

Kiểm chứng lần cập nhật lời thoại: **71 ca trình duyệt đạt** (studio 12, collection 20, gifts 17, welcome_effects 6, welcome_reading 7, signature_gardens 9), **457 kiểm tra codec đạt**; cú pháp toàn bộ JavaScript, ID/tài nguyên HTML và `git diff --check` đạt. Ca fallback dùng tài liệu trình duyệt mới để mô phỏng đúng việc script không tải được; ca chia sẻ mở trong context tách bộ nhớ. Đã kiểm tra ảnh thật ở 390 px và độ sáng chữ/nút trên hai cảnh đêm mới. Không thay thế kiểm tra trên Safari/iPhone thật.

Kiểm chứng bản nhạc theo nhóm / gợi ý mẫu / bé B góc màn hình: **73 ca trình duyệt đạt**, gồm recipient_studio 14, welcome_studio 12, collection 20, arrival 11, signature_gardens 9, welcome_effects 6 và ca thư viện gifts 1. Có kiểm tra 38 chủ đề đi qua cảnh mở thật, sáu câu chuyện mới giữ chuyển động khi đọc, phát MP3 thật, đổi nhóm lúc đang dò nhạc, tạm dừng không phát lại muộn, tự đổi bài khi bài kết thúc, độc lập bài gửi/âm lượng, sáu nhóm gợi ý phủ đủ 38 mẫu, trợ giúp cố định ở 360/390 px, hội thoại có giới hạn và ô hỏi trên vùng bàn phím thu nhỏ. **469 kiểm tra codec đạt**, cú pháp JavaScript và ID/tài nguyên HTML đạt. Các ca đối chiếu bàn phím dùng Chromium với VisualViewport thu nhỏ; chưa thay cho kiểm tra Safari/iPhone thật. Ảnh sáu cảnh và màn đọc điện thoại được kiểm tra trực quan thêm.

Kiểm tra HTTP bằng tài nguyên thật trong repository (không thay tệp nhạc bằng fixture): tìm đủ sáu bài cô giáo, bật/đổi ngẫu nhiên, chuyển sang nhạc chào rồi phát đúng `0co.mp3` ở thiệp, đọc cảnh Bài giảng nở hoa và mở trợ giúp góc màn hình đều đạt. Các script/stylesheet có mã phiên bản trả HTTP 200, không có lỗi JavaScript.


Bản cây tri ân / nhóm nhạc riêng / hướng dẫn tạo thiệp qua bé B: **74 ca trình duyệt đạt** (12 ca guide mới; recipient_studio 14, welcome_studio 12, collection 20, signature_gardens 9, welcome_effects 6, thư viện gifts 1), cùng **576 kiểm tra codec đạt**. Các ca mới kiểm tra nhạc khác nhóm vẫn giữ đúng người nhận và mở trên trình duyệt tách bộ nhớ; ba cảnh cô có chuyển động tiền cảnh và tiếp tục khi đọc; năm lời nhắn trên hoa sửa/chia sẻ như chữ thuần; bé B giải thích các điều khiển, hỏi từng bước, xem lại/áp dụng/hoàn tác cả chữ ký; quay lại/bỏ qua/hủy/giới hạn chữ; lời chào khi rảnh, kính và dừng khi ẩn; khung điện thoại/bàn phím; phân biệt “có” và “cô” khi nhận yêu cầu. Kiểm tra cú pháp 20 tệp JavaScript, 253 ID HTML duy nhất, 35 tham chiếu JS/CSS cục bộ và `git diff --check` đạt. Bộ này dùng Chromium, chưa kiểm tra thiết bị Safari/iPhone thật.

```bash
BASE_URL=http://127.0.0.1:8000/ python3 tests/test_assistant_guide.py
node tests/test_links.js
```

Ngoài luồng hỏi từng bước, bạn có thể nhắn **“đổi mẫu sang ngân hà”**, **“chọn bài 3”**, **“tắt hiệu ứng”**, **“giảm hiệu ứng”**, **“đổi tên người gửi thành An”**, **“đổi tên bé B thành Mây”** hoặc **“chữ ký là Thương bà · An”**. Bé B chỉnh đúng mục được gọi và có nút hoàn tác, giữ các mục khác. Trong bản nháp, có thể dùng lệnh đổi mẫu/nhạc/tên/chữ ký để sửa trước khi áp dụng. Tên mẫu được nhận cả qua hình dung như “nền đen”, “màu xanh”, “quyển sách”, “mẹ ôm con”; mẫu không nhận ra sẽ được hỏi lại. Các câu hỏi như “Chữ ký làm sao?” được giải thích, không biến thành lệnh ghi nội dung. Đây vẫn là bộ hướng dẫn và thao tác cục bộ cho ứng dụng thiệp, không gọi mô hình AI bên ngoài.



Bản mặc định theo người nhận / thiệp nháp trực tiếp / bé B kính đen: **75 ca trình duyệt đạt**, gồm scoped_companion 15, assistant_guide 12, recipient_studio 14, welcome_studio 12, collection 20 và hai ca cảnh mở/chữ ký đại diện. Các ca mới xác minh sáu nhóm được lọc ngay khi vào, đổi người nhận đặt lại bộ lọc, đủ 41 mẫu vẫn truy cập được; sáu bài nhạc/ví dụ đúng nhóm và chỉ đổi nhóm khi chủ động chọn; nháp cập nhật khi nhập nhưng chưa thay thiệp chính; nội dung nháp trùng thiệp nhận thật; sửa bằng lệnh/hoàn tác, hỏi giữa luồng và đổi người nhận; kính đen, bóng chạm đầu, lịch hoạt cảnh ngắn, dừng khi nhập hoặc giữ bút ký; giao diện 360/390 px và bàn phím mở. **576 kiểm tra codec**, cú pháp 20 tệp JavaScript, 253 ID HTML duy nhất, 35 tham chiếu JS/CSS và `git diff --check` đạt. Trình duyệt kiểm thử là Chromium; chưa xác minh trên thiết bị Safari/iPhone thật. Các bộ hồi quy cảnh mở chủ động chọn Tất cả để tiếp tục kiểm tra các mẫu ngoài nhóm mặc định.

```bash
BASE_URL=http://127.0.0.1:8000/ python3 tests/test_scoped_companion.py
```


Bản selfie / tạo nhanh trên điện thoại: **85 ca trình duyệt đạt** (quick_selfie 12, scoped_companion 15, assistant_guide 12, recipient_studio 14, welcome_studio 12, collection 20), cùng **576 kiểm tra codec**. Ca mới kiểm tra sáu nhóm tạo thiệp sau ba câu, nhận tên đã điền, chọn cảnh theo mô tả và đúng giọng lời chúc; mở thêm nhạc/chữ ký, chia sẻ đúng snapshot sang trình duyệt khác, quay lại/hoàn tác; nút Tiếp với ô tùy chọn trống, giữ tên quá dài để sửa, không chuyển câu khi đang ghép dấu tiếng Việt; selfie có điện thoại/flash thật bằng SVG/CSS nhưng không gọi camera/khởi động nhạc, hoạt cảnh khi rảnh và giảm chuyển động; điều khiển 320/360/390 px với vùng bàn phím 390/300 px. Câu hỏi mới tự cuộn vào vùng trò chuyện; thao tác tự lấy tiêu điểm trễ không chen vào khi người dùng đã bắt đầu nhập. Kiểm tra cú pháp 20 tệp JavaScript, 254 ID HTML duy nhất, 35 tham chiếu JS/CSS và `git diff --check` đạt. Thiết bị kiểm thử là Chromium mô phỏng; chưa xác minh Safari/iPhone thật.

```bash
BASE_URL=http://127.0.0.1:8000/ python3 tests/test_quick_selfie.py
```
