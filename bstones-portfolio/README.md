# BSTONES Portfolio

비스톤스 포트폴리오 웹사이트

## 📁 파일 구조

```
bstones-portfolio/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 파일
├── README.md           # 이 파일
└── assets/             # 이미지 폴더
    ├── kv_bg_v1.png    # Hero 배경 이미지 ✅
    └── (아래 이미지 추가 필요)
```

## 🖼️ 필요한 이미지 파일

Figma MCP 서버 URL에서 이미지를 다운로드하거나, Figma에서 직접 Export해주세요.

### Figma MCP 서버 URL (Figma 파일이 열려있을 때만 접근 가능)

| 파일명 | URL |
|--------|-----|
| `logo.png` | http://localhost:3845/assets/b1fd520f743915401ed850b67168174525960b13.png |
| `bubble_bg.svg` | http://localhost:3845/assets/4086e4b76a5cd7da1190bc400bb0a4a6fdaca01a.svg |
| `hero_icon.svg` | http://localhost:3845/assets/fac8aa07e766cc620e39938cb0dc8651a445a623.svg |
| `arrow.svg` | http://localhost:3845/assets/fa6d415c3b7ee2952c9652cb8cd3bbca2866f94f.svg |
| `history_icon.png` | http://localhost:3845/assets/9f29fe242d964b32ae099ff697b5a719f33618d9.png |
| `portfolio_thumb_01.png` | http://localhost:3845/assets/965aef555c917a33d85aaad1429f355c32fa5c03.png |
| `portfolio_thumb_02.png` | http://localhost:3845/assets/6119f8bdf0d232b8d92e62439d542cbb4f2a86eb.png |
| `bubble_bg_1.svg` | http://localhost:3845/assets/e74a050c06217e3fe006fdb9eb560544a08fe6cc.svg |
| `bubble_bg_2.svg` | http://localhost:3845/assets/ffda502dd08c711b13fa4e25c3f6d2d9e911699b.svg |
| `bubble_bg_3.svg` | http://localhost:3845/assets/04249edafb4b58ec416be429c1257d58fea4da64.svg |
| `timeline_arrow.svg` | http://localhost:3845/assets/950f75914523b1794279887df732874068a123fd.svg |
| `dot_purple.svg` | http://localhost:3845/assets/9684260ec5d211763764bf1b5d891d0b21986799.svg |
| `dot_blue.svg` | http://localhost:3845/assets/9d3d45801d20ac64cf3b3a6993ce91d7c3d131f5.svg |

### 다운로드 방법

**방법 1: 브라우저에서 직접 다운로드**
1. Figma 데스크탑 앱에서 해당 파일을 열어둡니다
2. 브라우저에서 위 URL을 입력합니다
3. 이미지를 우클릭 → "다른 이름으로 저장"

**방법 2: 터미널에서 다운로드 (Figma 파일 열어둔 상태)**
```bash
cd assets
curl -O "http://localhost:3845/assets/b1fd520f743915401ed850b67168174525960b13.png"
# ... 나머지 URL들도 동일하게
```

**방법 3: Figma에서 직접 Export**
1. Figma에서 해당 레이어 선택
2. 우측 패널 하단 Export 섹션
3. PNG/SVG 선택 후 Export

## 🚀 실행 방법

1. 이미지 파일을 `assets/` 폴더에 추가
2. `index.html`을 브라우저에서 열기
3. 또는 Live Server 등으로 로컬 서버 실행

## 🎨 디자인 특징

- **시맨틱 HTML5**: `<header>`, `<main>`, `<section>`, `<article>` 등
- **BEM 네이밍**: CSS 클래스 명명 규칙
- **반응형 디자인**: 1400px, 1024px, 768px 브레이크포인트
- **스크롤 애니메이션**: Intersection Observer API 활용
- **웹 접근성**: ARIA 속성, Skip navigation

## 📐 디자인 사양

- **캔버스 크기**: 1650 x 4180px
- **폰트**: Roboto, Noto Sans KR
- **주요 색상**:
  - Primary Text: #181818
  - Secondary Text: #606060
  - Accent Purple: #a98aca
  - Background: rgba(181, 200, 255, 0.15)

---

© 2026 BSTONES. All Rights Reserved.
