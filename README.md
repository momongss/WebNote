## ver2-refect

노트 관리 페이지에서도 노트를 열어볼 수 있게 App.js, component 들을 바꿔야겠다.
맨날 확장성, 재사용성 말로만 들었는데 실제로 재사용을 해야하는 상황이 생기니 당황스럽다.
App.js 를 작성할 때 그냥 일반 페이지에서만 열릴 것만 생각했지 다른 페이지에서 조금 다른 방식으로
열릴 상황은 고려하지 않았었다. 자세한 건 노션에 적겠다.

### 제목 파트

디자인

    - 내부 텍스트에 input 컨테이너 맞춤.
    - 마우스가 hover 되면 border 표시

---

동작

    - 클릭됬을 때 & 제목 == undefined (="제목 없는 문서")
        * 전체 선택
    - 엔터, ESC => 문서로 포커스 넘어감.
        * 제목 == "" => 제목 = undefined

### 알게된 것, 인상깊었던 것

- selection, range
  <br>selection과 range로 커서(caret) 조작을 할 수 있다.

- border도 공간을 차지하기 때문에
  <br>border 자체를 없애고/만들고 하게되면 디자인에 영향을 준다.
  <br>border 의 색상을 변경하는 것으로 처리를 해주는게 좋다.

  더 자세한 기록 :
  <https://www.notion.so/2-5e55bb53ae8e4d1a85122509bb40dbf9>

폰트색 : rgb(240, 248, 255)
