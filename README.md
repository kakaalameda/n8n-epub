# n8n‑EPUB Cookbook (Railway)

Bộ nguồn này gồm:
* **Dockerfile** – build image `n8n + epub-gen + epubcheck`
* **make-epub.js** – script gộp nội dung & ảnh thành EPUB 3
* **workflow.json** – workflow n8n mẫu (cần sửa thêm)
* **README.md** – hướng dẫn

## Triển khai trên Railway

```bash
# 1. Clone repo
git clone <your-fork>
cd n8n-epub

# 2. Đăng nhập Railway CLI
railway login

# 3. Khởi tạo project & deploy
railway init
railway up
```

Trong **Variables** hãy thêm:

| Key | Giá trị |
|-----|---------|
| `N8N_ENCRYPTION_KEY` | chuỗi ngẫu nhiên 32 ký tự |
| `TELEGRAM_BOT_TOKEN` | token bot của bạn |
| `OPENAI_API_KEY` | key GPT‑4o |
| `WEBHOOK_URL` | URL công khai Railway App (`https://xxx.up.railway.app/webhook`) |
| *(optional)* `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD` | để bảo vệ UI |

## Import workflow

1. Mở UI n8n (`https://<app>.railway.app/`).
2. Settings → Import → chọn file `workflow.json`.
3. Gán **credentials** cho:
   * Telegram Trigger / Send
   * OpenAI
4. Bật “Active”.  
   Bot sẵn sàng nhận lệnh:

    ```
    /newbook Tên ý tưởng cuốn sách
    ```

## Tuỳ chỉnh

* **make-epub.js** chỉ xử lý tối đa 10 chương – chỉnh `chaptersToGenerate`.
* Muốn thêm ảnh minh hoạ → prompt `###IMG:…###` trong mỗi chương.
* Bìa: tự tạo PNG 1600×2400 và add trong Apple Books Producer.

## Kiểm thử local

```bash
docker build -t n8n-epub .
docker run -it --rm -p 5678:5678 -e N8N_ENCRYPTION_KEY=xxx -e TELEGRAM_BOT_TOKEN=xxx -e OPENAI_API_KEY=sk-xxx n8n-epub
```

Truy cập `http://localhost:5678/`.

## Ghi chú

* EPUB tạo ra đã **pass epubcheck 5.1.0** – Apple Books chấp nhận.
* Ảnh > 3 MP sẽ bị cảnh báo. Script resize xuống 1024² (tuỳ chọn sửa).
* Nếu cần generate 30–70 trang ⇒ total token ~20k → GPT‑4o streaming ok, gpt‑3.5-gigapipe tiết kiệm chi phí hơn nhưng chất lượng xấu.

---
Generated 2025-05-24T13:58:45.737152Z