import App from "./App.js";

// app
// <i id="logo" class="fas fa-book"></i>
// <img id="logo" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/docs.svg" alt="문서">
// <object id="logo" type="image/svg+xml" data="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/docs.svg"></object>
const $app = document.createElement("div");
$app.className = "web-docs-app";
$app.innerHTML = `
<header>
    <div class="title-wrapper">
      <img id="logo" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/docs.svg" alt="문서">
      <div class="title" contenteditable="true"></div>      
      <img id="createBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/add.svg" alt="문서">
      <img id="deleteBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/trash.svg" alt="문서">
    </div>
    <img id="closeBtn" src="chrome-extension://mgffajndabdbnejmehloekjclmaikagb/assets/delete.svg" alt="문서">
</header>
<div class="docs-wrapper">
    <div class="content" contenteditable="true">
        <div><br /></div>
    </div>
</div>
`;
document.body.appendChild($app);

const app = new App({ $app: $app, mode: "normal" });

// svg
// https://svgontheweb.com/ko/
// https://nykim.work/35
