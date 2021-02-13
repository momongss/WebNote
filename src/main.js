const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
  <header>
    <i id="logo" class="fas fa-book"></i>
    <div class="title" contenteditable="true"></div>
  </header>
  <div class="docs-wrapper">
    <div class="docs" contenteditable="true">
      <div><br /></div>
    </div>
  </div>
  <script type="module" src="/src/components/docs.js"></script>
`;

document.body.appendChild($app);
