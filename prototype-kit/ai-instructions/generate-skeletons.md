# Portfolio page skeleton

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Tên trang] — Portfolio</title>
  <!-- core styles như các trang trong prototypes/portfolio/ -->
  <link rel="stylesheet" href="portfolio.css">
</head>
<body>
  <a class="skip-link" href="#main-content">Bỏ qua điều hướng</a>
  <div class="app-shell">
    <aside class="sidebar" id="sidebar" aria-label="Điều hướng portfolio"></aside>
    <div class="main-area">
      <main class="content-zone portfolio-page" id="main-content">
        <header class="portfolio-wrap page-intro">...</header>
        <section class="portfolio-section">...</section>
      </main>
    </div>
  </div>
  <!-- shell.js → sidebar.js → shared-nav.js → portfolio.js -->
</body>
</html>
```

Mỗi page phải có một `h1`, landmark rõ ràng, thứ tự heading hợp lý và đường quay về nội dung liên quan.

