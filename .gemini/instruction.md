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

---

## Tách Câu hỏi & Đáp án ra file JSON riêng (2026-05-04)

### Mục tiêu
- Tách toàn bộ nội dung câu hỏi và đáp án ra khỏi `index-texts.json`, `index.html` và các file JavaScript (`dixit.js`).
- Đồng bộ cơ chế với `khoidong.json`.

### Các thay đổi đã thực hiện

1.  **Cấu trúc dữ liệu mới (uploads/)**:
    - `feud.json`: Chứa câu hỏi FEUD (lấy từ HTML) và 6 đáp án mỗi vòng (lấy từ `index-texts.json`).
    - `dixit.json`: Chứa danh sách các keywords và vòng chơi của game DIXIT (lấy từ `dixit.js`).
    - `hoso.json`: Chứa các "Hồ sơ ẩn danh" và nội dung dẫn dắt của Hoạt động 3 (lấy từ `index-texts.json`).

2.  **Content Loader (`content-loader.js`)**:
    - Nâng cấp hàm `fetch` để tải đồng thời nhiều file JSON (`index-texts.json`, `feud.json`, `hoso.json`).
    - Triển khai hàm `mergeDeep` để gộp các object dữ liệu lại thành một bộ dictionary duy nhất.

3.  **Dọn dẹp Giao diện (`index.html`)**:
    - Loại bỏ hoàn toàn phần text câu hỏi FEUD bị hardcode.

4.  **Refactor Logic Game (`dixit.js`)**:
    - Logic `fetch('uploads/dixit.json')` để lấy dữ liệu động khi khởi tạo game.

### Kết quả
- Toàn bộ nội dung "mềm" đã được đưa ra các file JSON riêng biệt trong thư mục `uploads/`.
- File `index.html` và `index-texts.json` trở nên gọn gàng hơn.

---

## Nâng cấp Giao diện Game FEUD (2026-05-04)

### Mục tiêu
- Chuyển đổi số lượng đáp án từ 6 xuống còn **4 đáp án** cho mỗi vòng.
- Đại tu giao diện (UI) để trở nên sang trọng, hiện đại và "premium" hơn theo yêu cầu của người dùng.
- Tối ưu hóa bố cục lưới (grid) cho 4 đáp án.

### Kế hoạch thực hiện
1.  **Cấu hình (`feud.json`)**: Cắt giảm dữ liệu `item5`, `item6` trong tất cả các vòng chơi.
2.  **Giao diện (`index.html`)**:
    - Thay đổi grid từ 2x3 sang 2x2.
    - Tăng kích thước các `feud-cell` để tạo sự nổi bật.
    - Áp dụng các hiệu ứng thị giác hiện đại (gradients, glassmorphism, shadow).
    - Cải thiện phần hiển thị câu hỏi và timer để đồng bộ với thiết kế mới.
3.  **Logic (`feud.js`)**: Đảm bảo các hàm khởi tạo hoạt động tốt với bố cục mới.
4.  **Git**: Lưu lại lịch sử commit sau khi hoàn thành.

---

## Loại bỏ khung viền trang trí Party-Frame (2026-05-04)

### Mục tiêu
- Loại bỏ khung hình chữ nhật trang trí có 2 màu đỏ và vàng bao quanh background của slide.
- Khung này được xác định là class `.party-frame` trong CSS và được chèn trực tiếp vào nhiều slide trong HTML.

### Kế hoạch thực hiện
1. **Phân tích**: Xác định các thành phần liên quan đến khung viền đỏ-vàng bao gồm:
   - Class `.party-frame` trong `styles.css`.
   - Các pseudo-elements `::before` (viền đỏ) và `::after` (viền vàng).
   - Các thành phần trang trí góc như `.corner-ornament` và `.corner-star`.
2. **Hành động**:
   - Xóa bỏ định nghĩa các class này trong `styles.css`.
   - Xóa bỏ các thẻ `<div class="party-frame">` cùng nội dung bên trong của chúng trong `index.html`.
3. **Kiểm tra**: Đảm bảo giao diện không còn khung bao quanh nhưng vẫn giữ được các thành phần nội dung chính.
4. **Git**: Thực hiện commit toàn bộ thay đổi từ root directory.

### Kết quả thực hiện (2026-05-04)
- Đã xóa bỏ hoàn toàn hệ thống khung viền `.party-frame` trong `styles.css`.
- Đã loại bỏ tất cả các thẻ DIV trang trí liên quan đến `party-frame` (bao gồm các góc và ngôi sao) trong file `index.html`.
- Giao diện hiện tại đã thoáng đãng hơn, không còn khung viền bao quanh các slide.
- Đã thực hiện commit toàn bộ thay đổi từ root directory.

---

## Thêm nút "Lộ diện nhân vật" trong Game DIXIT (2026-05-04)

### Mục tiêu
- Thêm một nút bấm "Lộ diện nhân vật" vào slide chơi game DIXIT (Hoạt động 01).
- Khi bấm nút, hiển thị tên nhân vật tương ứng với vòng chơi hiện tại.
- Dữ liệu tên nhân vật được lấy từ file `uploads/dixit.json`.

### Kế hoạch thực hiện
1. **Dữ liệu (`uploads/dixit.json`)**: Cấu trúc lại để mỗi vòng chơi (`round`) có thêm trường `character` chứa tên nhân vật.
2. **Ngôn ngữ (`uploads/index-texts.json`)**: Thêm key `controls.reveal` cho nút bấm mới.
3. **Giao diện (`index.html`)**:
   - Thêm nút bấm vào nhóm điều khiển (cạnh nút Round tiếp).
   - Thêm một khu vực hiển thị tên nhân vật (mặc định ẩn).
4. **Logic (`dixit.js`)**:
   - Triển khai hàm `revealCharacter()` để hiển thị tên nhân vật.
   - Cập nhật hàm `render()` để xóa trạng thái hiển thị tên nhân vật khi chuyển vòng hoặc reset.
5. **Git**: Thực hiện commit toàn bộ thay đổi.

### Kết quả thực hiện (2026-05-04)
- Đã thêm trường `character` vào `uploads/dixit.json` cho cả 3 vòng chơi.
- Đã bổ sung text `reveal` vào `uploads/index-texts.json`.
- Đã thêm nút bấm "Lộ diện nhân vật" và khu vực hiển thị tên nhân vật vào `index.html`.
- Đã triển khai logic `revealCharacter()` trong `dixit.js` để hiển thị tên và cuộn tới vùng hiển thị.
- Đã đảm bảo tên nhân vật biến mất khi chuyển vòng hoặc reset.
- Đã thực hiện commit toàn bộ thay đổi.
