### Phân tích yêu cầu ngày 04/05/2026

**1. Mục tiêu:**
- Chuyển toàn bộ các text đã được hardcode trong file `index.html` sang file JSON (`uploads/index-texts.json`).
- Ngoại trừ: Các tiêu đề của slide trò chơi (Game board title / round title).
- Refactor lại file `index.html` để loại bỏ các text hardcode đã được chuyển sang JSON (giữ lại code sạch gọn).
- Thực hiện lưu lại lịch sử commit qua Git đầy đủ từ root directory.
- Luôn sử dụng tiếng Việt có dấu.
- Tuyệt đối không sử dụng icon trong mọi text / code.

**2. Kế hoạch thực hiện:**
- Viết một script Node.js nhỏ để đọc file `index.html` bằng thư viện như `cheerio` hoặc regex, trích xuất tất cả các giá trị của thuộc tính `data-i18n` và `data-i18n-html`.
- Ánh xạ các text bên trong thẻ HTML tương ứng với các key này để xây dựng một object JSON.
- Đọc file `uploads/index-texts.json` hiện tại, merge dữ liệu mới vào.
- Với các phần được đánh dấu là "tiêu đề slide trò chơi", ta không xóa hardcode text của chúng trong `index.html`.
- Xóa text hardcode trong `index.html` đối với những phần đã chuyển sang JSON, chỉ giữ lại thẻ HTML với các thuộc tính `data-i18n`.
- Git add và commit.

**4. Kết quả thực hiện (Ngày 04/05/2026):**
- Đã trích xuất thành công toàn bộ text từ `index.html` sang `uploads/index-texts.json`.
- Đã bỏ qua các thẻ tiêu đề trò chơi (`hd1.gameBoard.heading` và từ `hd2.round1.questionHtml` đến `hd2.round5.questionHtml`).
- Làm sạch file `index.html` (loại bỏ text cứng bên trong thẻ HTML cho những phần đã được chuyển sang JSON) và format lại code bằng Prettier.
- Đã thực hiện `git init` (nếu chưa có), `git add .` và `git commit` từ thư mục gốc để lưu lại toàn bộ lịch sử chỉnh sửa.
