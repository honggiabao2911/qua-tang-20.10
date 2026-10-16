# Nhạc cho thiệp 20/10

Mỗi thiệp dùng một trong **6 nhóm nhạc**, mỗi nhóm có **6 vị trí từ 0 đến 5**. Bạn nữ và nhóm phụ nữ cùng dùng nhóm `nu`; chị gái và em gái cùng dùng nhóm `chi`. Chủ đề hình ảnh không thay đổi nhóm nhạc.

Đặt các file MP3 thật vào **`assets/music/`**. Tên file phân biệt chữ hoa/thường trên GitHub Pages; dùng đúng chữ thường và đuôi **`.mp3`**, kể cả `0ba.mp3`.

## Danh sách file cần bổ sung

Hiện cả **36 đường dẫn chuẩn dưới đây chưa có file**. Bốn vị trí có thể nghe được nhờ file cũ được giữ nguyên, nên còn **32 vị trí chưa có bản nhạc**. Không có file rỗng hoặc một bài bị sao chép để giả thành nhiều lựa chọn.

| Thiệp | Sáu tên file trong `assets/music/` |
|---|---|
| Mẹ | `0me.mp3`, `1me.mp3`, `2me.mp3`, `3me.mp3`, `4me.mp3`, `5me.mp3` |
| Bà | `0ba.mp3`, `1ba.mp3`, `2ba.mp3`, `3ba.mp3`, `4ba.mp3`, `5ba.mp3` |
| Cô giáo | `0co.mp3`, `1co.mp3`, `2co.mp3`, `3co.mp3`, `4co.mp3`, `5co.mp3` |
| Chị/em gái | `0chi.mp3`, `1chi.mp3`, `2chi.mp3`, `3chi.mp3`, `4chi.mp3`, `5chi.mp3` |
| Bạn nữ/nhóm phụ nữ | `0nu.mp3`, `1nu.mp3`, `2nu.mp3`, `3nu.mp3`, `4nu.mp3`, `5nu.mp3` |
| Người thương | `0yeu.mp3`, `1yeu.mp3`, `2yeu.mp3`, `3yeu.mp3`, `4yeu.mp3`, `5yeu.mp3` |

Các file cũ **không bị xóa, đổi tên hoặc suy đoán tên bài hát**. Chúng được dùng làm nguồn dự phòng theo nhóm mà phiên bản trước đã sử dụng:

| Đường dẫn chuẩn ưu tiên | File cũ dự phòng | Cơ sở phân nhóm |
|---|---|---|
| `assets/music/0me.mp3` | `nhac_me.mp3` | Đã dùng cho thiệp mẹ |
| `assets/music/0ba.mp3` | `nhac_ba.mp3` | Đã dùng cho thiệp bà |
| `assets/music/0nu.mp3` | `music_under.mp3` | Đã dùng cho thiệp bạn nữ |
| `assets/music/1nu.mp3` | `music_over.mp3` | Đã dùng cho thiệp nhóm phụ nữ |

Đây là ánh xạ để giữ nhạc cũ hoạt động, không phải xác nhận nội dung hay tên bản thu. Hãy nghe và xác nhận trước khi cập nhật tên bài/nghệ sĩ. Khi có file đúng đường dẫn chuẩn, website ưu tiên file đó. Giữ các file cũ để những liên kết trước đây tiếp tục hoạt động.

## Hướng chọn sáu bài cho mỗi nhóm

Đây là **gợi ý sắc thái**, không phải danh sách bản thu đã cài đặt.

| Nhóm | Vị trí 0 | Vị trí 1 | Vị trí 2 | Vị trí 3 | Vị trí 4 | Vị trí 5 |
|---|---|---|---|---|---|---|
| Mẹ | Ca khúc về mẹ | Ca khúc gia đình ấm áp | Piano dịu | Guitar acoustic | Piano và dây | Không lời tươi sáng |
| Bà | Giai điệu quê hương | Ca khúc về bà phù hợp | Đàn tranh nhẹ | Guitar mộc | Piano hoài niệm | Hòa tấu ấm áp |
| Cô giáo | Ca khúc tri ân | Ca khúc tuổi học trò | Piano trong trẻo | Guitar nhẹ | Hòa tấu dây | Không lời trang nhã |
| Chị/em gái | Pop vui | Acoustic tích cực | Lo-fi sáng | Ukulele | Piano vui | Chill không lời |
| Bạn nữ/nhóm | Pop tích cực | Acoustic tươi | Lo-fi nhẹ | Bossa nova | Piano sáng | Hòa tấu vui |
| Người thương | Tình ca ngọt ngào | Tình ca đồng hành | Acoustic lãng mạn | Piano tình cảm | Chill R&B phù hợp | Không lời kiểu điện ảnh |

Một vài tên bài để bạn tìm nghe và cân nhắc bản thu phù hợp:

- **Mẹ:** “Mẹ yêu”; có thể thêm một bản guitar hoặc piano ấm áp không lời.
- **Bà:** “Cháu yêu bà” nếu muốn nét vui, gần gũi; hoặc một bản hòa tấu đàn tranh giai điệu quê hương.
- **Cô giáo:** “Bụi phấn”, “Người thầy”; kiểm tra lời của bản thu để chọn cách gọi phù hợp với cô.
- **Chị/em gái, bạn nữ:** “Sống như những đóa hoa”, hoặc pop/acoustic tươi sáng không mang nội dung tỏ tình.
- **Người thương:** “Hơn cả yêu”, “Ngày đầu tiên”; chọn bản thu có cách xưng hô phù hợp với người nhận.

Các tên trên chỉ là gợi ý, **chưa có các bản thu này trong dự án**. Dùng bản thu bạn có quyền đưa lên website. Tránh bài chia tay, mất mát hoặc có lời lệch với người nhận, đặc biệt trong thiệp gửi mẹ và bà.

## Cập nhật danh mục và sử dụng

Danh mục nằm ở [`assets/music/catalog.json`](assets/music/catalog.json), bộ phát nằm ở [`assets/js/card-music.js`](assets/js/card-music.js). Mỗi bài có ID, đường dẫn, tên hiển thị và nghệ sĩ tùy chọn. Số thứ tự trong tên file chỉ là vị trí; website không đoán tên bài từ số đó.

1. Thêm MP3 vào `assets/music/` theo đúng tên trong bảng.
2. Cập nhật tên hiển thị và nghệ sĩ trong danh mục nếu đã xác định bản thu; giữ ID và đường dẫn để liên kết đã gửi vẫn trỏ đúng vị trí.
3. Chạy website qua HTTP, chọn đúng người nhận, mở phần Âm nhạc và chọn **Kiểm tra lại các bài nhạc**.
4. Nghe thử bài, mở thiệp và kiểm tra nút phát/dừng. Chia sẻ liên kết mới khi đã chọn bài mong muốn.

Thiếu file sẽ hiện **“Chưa có tệp nhạc”**; người nhận vẫn đọc được thiệp và không bị chuyển sang nhạc của đối tượng khác. Website chỉ dùng một phần tử phát âm thanh để tránh nhiều bài phát chồng nhau, không tải trước cả 36 bản MP3. Nhạc bắt đầu từ thao tác chạm mở thiệp hoặc nút nghe thử/phát; nếu trình duyệt chặn, người nhận có thể chạm lại nút nhạc. Trên iPhone và một số trình duyệt, hãy dùng nút âm lượng của thiết bị nếu thanh âm lượng của website không thay đổi âm thanh.

Liên kết chia sẻ lưu ID bài, không nhúng file âm thanh. File cần được đưa lên cùng website thì người nhận mới nghe được.
