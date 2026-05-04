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

---

## Nâng cấp Giao diện Điểm số trên Thẻ bài DIXIT (2026-05-04)

### Mục tiêu
- Tăng kích thước chữ hiển thị điểm số (ví dụ: +30 ĐIỂM) trên mặt sau của thẻ bài DIXIT.
- Thay đổi font chữ sang loại dễ đọc hơn (hiện tại đang dùng JetBrains Mono cỡ nhỏ khó quan sát).

### Kế hoạch thực hiện
1. **Logic (`dixit.js`)**:
   - Tìm đến đoạn mã khởi tạo giao diện mặt sau của thẻ bài (`flip-back`).
   - Thay đổi font-family từ `'JetBrains Mono', monospace` sang `var(--font-sans)` hoặc `var(--font-serif)`.
   - Tăng font-size từ `14px` lên khoảng `26px` - `28px`.
   - Điều chỉnh font-weight và opacity để tăng độ tương phản.
2. **Git**: Thực hiện commit toàn bộ thay đổi.

### Kết quả thực hiện (2026-05-04)
- Đã thay đổi font chữ điểm số trên mặt sau thẻ bài DIXIT sang `var(--font-sans)` (Be Vietnam Pro) và thiết lập độ đậm `800`.
- Đã tăng kích thước chữ điểm số từ `14px` lên `26px` để dễ quan sát từ xa.
- Điều chỉnh khoảng cách lề (`margin-top`) để bố cục cân đối hơn sau khi tăng size chữ.
- Đã thực hiện commit toàn bộ thay đổi.

---

## Tạo slide Background Tọa đàm phong cách Đảng Cộng sản (2026-05-04)

### Mục tiêu
- Tạo một slide mới dùng làm background cho buổi tọa đàm (Hoạt động 03).
- Thiết kế theo tiêu chí Đảng Cộng sản: màu đỏ và vàng chủ đạo.
- Kết hợp 2 bộ font chính của dự án (`var(--font-sans)` và `var(--font-serif)`).
- Tạo ấn tượng sang trọng, uy nghiêm nhưng vẫn hiện đại.

### Kế hoạch thực hiện
1. **Ngôn ngữ (`uploads/index-texts.json`)**: Thêm các key cho slide mới (tiêu đề, nội dung dẫn dắt).
2. **Giao diện (`index.html`)**:
   - Thêm một thẻ `<section>` mới với `data-screen-label="Background Toa Dam"`.
   - Sử dụng background gradient đỏ đậm (deep red) sang đen.
   - Thêm họa tiết ngôi sao vàng (biểu tượng Đảng) làm backdrop ẩn dưới nền.
   - Thiết kế tiêu đề kết hợp font Serif (cho các từ khóa quan trọng) và font Sans (cho lời dẫn).
   - Thêm các hiệu ứng animation nhẹ nhàng để slide trông sống động.
### Kết quả thực hiện (2026-05-04)
- Đã thêm slide mới "31.5 HD3 Background Tọa đàm" vào `index.html`.
- Thiết kế background sử dụng gradient đỏ đậm (deep red) phối hợp với ngôi sao vàng biểu trưng Đảng Cộng sản ẩn dưới nền.
- Tiêu đề kết hợp tinh tế giữa font Sans-serif (cho từ "Tọa đàm") và Serif Italic (cho từ "Đối thoại") để tạo sự hiện đại và trang trọng.
- Đã bổ sung các key ngôn ngữ tương ứng trong `uploads/index-texts.json`.
- Sử dụng các lớp animation có sẵn để đảm bảo slide hiển thị mượt mà.
- Đã thực hiện commit toàn bộ thay đổi.

---

## Cập nhật Slide Background Tọa đàm theo phong cách Slide Cover (2026-05-04)

### Mục tiêu
- Cập nhật slide "Background Toa Dam" (`31.5`) để có giao diện tương tự như slide Cover (slide đầu tiên).
- Thêm hình ảnh và thông tin của 3 khách mời (diễn giả chính) vào slide.
- Duy trì tiêu chí Đảng Cộng sản (Đỏ-Vàng) và kết hợp 2 font chữ.

### Kế hoạch thực hiện
1. **Giao diện (`index.html`)**:
   - Thay đổi nền slide thành màu đỏ (`var(--red)`).
   - Thêm dòng metadata ở phía trên (giống slide Cover) với thông tin về chuyên đề và hoạt động.
   - Bố trí lại tiêu đề ở phần trên của slide.
   - Thêm một container chứa 3 thẻ khách mời (`g1`, `g2`, `g3`) ở phía dưới tiêu đề.
   - Sử dụng layout card tương tự như slide 29 nhưng tinh chỉnh để phù hợp với nền đỏ (ví dụ: dùng border vàng hoặc nền trắng nhẹ).
2. **Ngôn ngữ (`uploads/index-texts.json`)**: Đảm bảo các key cho metadata và thông tin khách mời được sử dụng đúng.
### Kết quả thực hiện (2026-05-04)
- Đã cập nhật slide "31.5 HD3 Background Tọa đàm" với bố cục tương tự slide Cover (slide đầu tiên).
- Sử dụng nền đỏ (`var(--red)`), hai thanh chắn vàng trên-dưới và ngôi sao vàng xoay đặc trưng.
- Đã thêm metadata row ở phía trên slide cho đồng nhất với phong cách Cover.
- Bố trí 3 thẻ hiển thị hình ảnh và thông tin của 3 diễn giả chính (`g1`, `g2`, `g3`) theo dạng lưới 3 cột.
- Thẻ khách mời sử dụng hiệu ứng kính (`backdrop-filter`) và viền vàng để nổi bật trên nền đỏ.
- Đã thực hiện commit toàn bộ thay đổi.

---

## Di chuyển Slide Background Tọa đàm (2026-05-04)

### Mục tiêu
- Di chuyển slide "Background Toa Dam" (`31.5`) từ vị trí hiện tại (sau Phase 2) lên vị trí ngay sau slide "Thành phần diễn giả" (Slide 29).
- Đảm bảo luồng trình bày logic: Giới thiệu diễn giả -> Background chung cho tọa đàm -> Các phase chi tiết.

### Kế hoạch thực hiện
1. **Giao diện (`index.html`)**:
   - Xóa bỏ khối mã của slide `31.5` tại vị trí cũ (khoảng dòng 3706).
   - Chèn lại khối mã này vào ngay sau section của slide 29 (khoảng dòng 3221).
2. **Git**: Thực hiện commit toàn bộ thay đổi.
