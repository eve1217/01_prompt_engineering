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
    ├── kv_bg_v1.png    # Hero 배경 이미지
    └── (아래 이미지 추가 필요)
```

## 🖼️ 필요한 이미지 파일

Figma에서 다음 이미지들을 Export하여 `assets/` 폴더에 저장해주세요:

| 파일명 | 설명 | Figma 레이어 |
|--------|------|--------------|
| `logo.png` | 헤더 로고 | bstones_w 1 |
| `bubble_bg.svg` | Hero 버블 배경 | Bubble BG |
| `hero_icon.svg` | Hero 아이콘 | img |
| `arrow.svg` | 버튼 화살표 | Vector 170 |
| `history_icon.png` | 연혁 아이콘 | Copilot_20260108_134047 1 |
| `portfolio_thumb_01.png` | 포트폴리오 썸네일 1 | portfolio_thumb_0003 1 |
| `portfolio_thumb_02.png` | 포트폴리오 썸네일 2 | portfolio_thumb_2405 1 |
| `bubble_bg_1.svg` | 포트폴리오 배경 버블 1 | Bubble BG3 |
| `bubble_bg_2.svg` | 포트폴리오 배경 버블 2 | Bubble BG2 |
| `bubble_bg_3.svg` | 포트폴리오 배경 버블 3 | Bubble BG3 (하단) |
| `timeline_arrow.svg` | 타임라인 화살표 | Vector |
| `dot_purple.svg` | 보라색 도트 (선택) | Ellipse 191 |
| `dot_blue.svg` | 파란색 도트 (선택) | Ellipse 192 |

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

## ⚙️ 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

© 2026 BSTONES. All Rights Reserved.
