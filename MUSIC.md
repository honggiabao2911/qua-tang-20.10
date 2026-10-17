# Nhạc cho thiệp 20/10

Mỗi thiệp dùng một trong **6 nhóm nhạc**, mỗi nhóm có **6 vị trí từ 0 đến 5**. Bạn nữ và nhóm phụ nữ cùng dùng nhóm `nu`; chị gái và em gái cùng dùng nhóm `chi`. Chủ đề hình ảnh không thay đổi nhóm nhạc.

Đặt các file MP3 thật vào **`assets/music/`**. Tên file phân biệt chữ hoa/thường trên GitHub Pages; dùng đúng chữ thường và đuôi **`.mp3`**, kể cả `0ba.mp3`.

## Danh sách file cần bổ sung

Đã có **11 file chuẩn** bạn tải lên `main`: 6 file cho Mẹ (`0me.mp3` đến `5me.mp3`) và 5 file cho Bà (`0ba.mp3` đến `4ba.mp3`), đều trong `assets/music/` và đã kiểm tra là MP3 hợp lệ. Còn **25 đường dẫn chuẩn chưa có file**. Hai vị trí trong nhóm `nu` nghe được nhờ file cũ, nên còn **23 vị trí chưa có bản nhạc**: `5ba`, `0–5co`, `0–5chi`, `2–5nu`, `0–5yeu` (đều đuôi `.mp3`). Không suy đoán tên bản thu từ số thứ tự.

| Thiệp | Sáu tên file trong `assets/music/` |
|---|---|
| Mẹ | `0me.mp3`, `1me.mp3`, `2me.mp3`, `3me.mp3`, `4me.mp3`, `5me.mp3` |
| Bà | `0ba.mp3`, `1ba.mp3`, `2ba.mp3`, `3ba.mp3`, `4ba.mp3`, `5ba.mp3` |
| Cô giáo | `0co.mp3`, `1co.mp3`, `2co.mp3`, `3co.mp3`, `4co.mp3`, `5co.mp3` |
| Chị/em gái | `0chi.mp3`, `1chi.mp3`, `2chi.mp3`, `3chi.mp3`, `4chi.mp3`, `5chi.mp3` |
| Bạn nữ/nhóm phụ nữ | `0nu.mp3`, `1nu.mp3`, `2nu.mp3`, `3nu.mp3`, `4nu.mp3`, `5nu.mp3` |
| Người thương | `0yeu.mp3`, `1yeu.mp3`, `2yeu.mp3`, `3yeu.mp3`, `4yeu.mp3`, `5yeu.mp3` |

Các file cũ **không bị xóa, đổi tên hoặc suy đoán tên bài hát**. Những file `.MP3` bạn tải ở thư mục gốc cũng được giữ; website dùng các đường dẫn chuẩn chữ thường dưới `assets/music/`. Chúng được dùng làm nguồn dự phòng theo nhóm mà phiên bản trước đã sử dụng:

| Đường dẫn chuẩn ưu tiên | File cũ dự phòng | Cơ sở phân nhóm |
|---|---|---|
| `assets/music/0me.mp3` | `nhac_me.mp3` | Đã dùng cho thiệp mẹ |
| `assets/music/0ba.mp3` | `nhac_ba.mp3` | Đã dùng cho thiệp bà |
| `assets/music/0nu.mp3` | `music_under.mp3` | Đã dùng cho thiệp bạn nữ |
| `assets/music/1nu.mp3` | `music_over.mp3` | Đã dùng cho thiệp nhóm phụ nữ |

Đây là ánh xạ để giữ nhạc cũ hoạt động, không phải xác nhận nội dung hay tên bản thu. Hãy nghe và xác nhận trước khi cập nhật tên bài/nghệ sĩ. Khi có file đúng đường dẫn chuẩn, website ưu tiên file đó. Giữ các file cũ để những liên kết trước đây tiếp tục hoạt động.

## Nhạc cho người đưa quà

Màn chào có bản **Một chút ánh sáng**, nhạc không lời celesta/pad dài 24 giây được tạo riêng cho dự án, tại `assets/music/loichao.mp3`. Không lấy âm thanh từ trang/video tham khảo. Có thể thay chính tệp này bằng MP3 mong muốn; tên hiển thị trong màn chào không suy đoán bài hát của tệp thay thế. Nhạc này dùng chung cho tên nhân vật do người tạo thiệp đặt, không bị cố định vào tên bé B.

Trong **Màn chào đón**, bật/tắt **Nhạc hộp nhạc cho màn chào**; lựa chọn đi theo liên kết chia sẻ. Website thử phát khi bắt đầu màn chào. Nếu trình duyệt chặn âm thanh, người nhận chạm **Bật nhạc chào** hoặc nhân vật để nghe; phần dẫn và nút nhận hoa vẫn hoạt động. Khi nhận hoa hoặc bỏ qua, nhạc chào dừng và cùng phần tử audio chuyển sang bài người gửi chọn cho thiệp. Tắt nhạc thủ công được giữ qua chuyển cảnh và xem lại. Không khởi động lại bài thiệp khi chuyển từ hoa sang phần đọc.

Chỉ có **một phần tử audio** cho ba chế độ: nhạc làm thiệp, nhạc chào và nhạc đọc thiệp. Ẩn tab tạm dừng nhạc chào; quay lại tiếp tục ở vị trí cũ. Tệp chào lỗi hoặc thiếu không cản mở thiệp và không làm thay đổi trạng thái có/thiếu của các bài người nhận.

## Nhạc riêng khi tạo thiệp

Đặt **`nhac.mp3` ở thư mục gốc**, cùng `index.html`. Nếu cần, có thể đặt tại `assets/music/nhac.mp3`; website ưu tiên đường dẫn gốc. Hiện chưa có tệp này trong repository. Thanh nhạc làm thiệp báo rõ khi thiếu tệp và không lấy bài của người nhận để thay thế.

Nhạc làm thiệp có nút bật/tắt, âm lượng riêng và chỉ bắt đầu sau thao tác của người dùng. Khi mở món quà, nhạc làm thiệp dừng; tấm thiệp dùng đúng bài người gửi đã chọn. Nghe thử bài cho người nhận cũng dừng nhạc làm thiệp. Cả hai chế độ dùng một phần tử audio để tránh phát chồng.

## Cập nhật danh mục và sử dụng

Danh mục nằm ở [`assets/music/catalog.json`](assets/music/catalog.json), bộ phát nằm ở [`assets/js/card-music.js`](assets/js/card-music.js). Mỗi bài có ID, đường dẫn, tên hiển thị và nghệ sĩ tùy chọn. Số thứ tự trong tên file chỉ là vị trí; website không đoán tên bài từ số đó.

1. Thêm MP3 vào `assets/music/` theo đúng tên trong bảng.
2. Cập nhật tên hiển thị và nghệ sĩ trong danh mục nếu đã xác định bản thu; giữ ID và đường dẫn để liên kết đã gửi vẫn trỏ đúng vị trí.
3. Chạy website qua HTTP, chọn đúng người nhận, mở phần Âm nhạc và chọn **Kiểm tra lại các bài nhạc**.
4. Nghe thử bài, mở thiệp và kiểm tra nút phát/dừng. Chia sẻ liên kết mới khi đã chọn bài mong muốn.

Thiếu file sẽ hiện **“Chưa có tệp nhạc”**; người nhận vẫn đọc được thiệp và không bị chuyển sang nhạc của đối tượng khác. Website chỉ dùng một phần tử phát âm thanh để tránh nhiều bài phát chồng nhau, không tải trước cả 36 bản MP3. Nhạc bắt đầu từ thao tác chạm mở thiệp hoặc nút nghe thử/phát; nếu trình duyệt chặn, người nhận có thể chạm lại nút nhạc. Trên iPhone và một số trình duyệt, hãy dùng nút âm lượng của thiết bị nếu thanh âm lượng của website không thay đổi âm thanh.

Liên kết chia sẻ lưu ID bài, không nhúng file âm thanh. File cần được đưa lên cùng website thì người nhận mới nghe được.
