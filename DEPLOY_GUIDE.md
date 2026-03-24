# K-IMPACT Media Group — 최종 배포 가이드

> 작성일: 2026년 3월 24일 | 버전: Final Deploy

---

## 1. GitHub 업로드 구조

ZIP 압축 해제 후 `kimpact-deploy/` 폴더 내부 파일 전체를 GitHub 리포지토리 **root**에 업로드합니다.

```
(GitHub root)
├── index.html          ← K-IMPACT Media Group 메인
├── ceo.html            ← CEO 소개 페이지
├── robots.txt          ← 검색엔진 크롤러 허용 설정
├── sitemap.xml         ← 전체 사이트맵
├── vercel.json         ← Vercel 배포 설정
├── assets/
│   ├── css/style.css
│   ├── js/i18n.js
│   ├── js/main.js
│   └── images/
│       ├── logo-dark.png
│       ├── logo-light.png
│       ├── kbeauty-logo.png
│       └── ceo-profile.jpg
├── k-beauty/
│   ├── index.html      ← K-Beauty Intelligence 메인
│   ├── deals.html      ← K-Beauty Deals Engine
│   ├── brands.html
│   ├── products.html
│   ├── intelligence.html
│   ├── creators.html
│   ├── top100-brands.html
│   ├── top100-products.html
│   ├── best-serums.html
│   ├── best-sunscreens.html
│   ├── best-cleansers.html
│   ├── best-moisturizers.html
│   ├── best-essences.html
│   ├── about.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/
└── shared/
    ├── auth.js
    └── auth.css
```

---

## 2. Vercel 배포 절차

1. GitHub에 위 구조로 파일 업로드 (리포지토리 root 기준)
2. [vercel.com](https://vercel.com) → New Project → GitHub 리포지토리 연결
3. Framework Preset: **Other** (정적 사이트)
4. Root Directory: `/` (기본값 유지)
5. Build Command: 비워둠 (정적 사이트)
6. Output Directory: 비워둠
7. Deploy 클릭

---

## 3. 네이버/구글 검색 등록

### Google Search Console
1. [search.google.com/search-console](https://search.google.com/search-console) 접속
2. URL 접두어 방식으로 `https://kimpactmedia.com` 등록
3. 소유권 확인 (HTML 파일 또는 메타 태그 방식)
4. Sitemap 제출: `https://kimpactmedia.com/sitemap.xml`

### 네이버 서치어드바이저
1. [searchadvisor.naver.com](https://searchadvisor.naver.com) 접속
2. 사이트 등록: `https://kimpactmedia.com`
3. 소유권 확인 후 사이트맵 제출: `https://kimpactmedia.com/sitemap.xml`

---

## 4. SEO 최적화 완료 내역

| 페이지 | Title | Meta Description | OG Tags |
|--------|-------|-----------------|---------|
| index.html | K-IMPACT Media Group \| Global Cross-Border Media | ✓ | ✓ |
| ceo.html | Leadership \| K-IMPACT Media Group | ✓ | ✓ |
| k-beauty/index.html | K-Beauty Intelligence Platform \| K-IMPACT | ✓ | ✓ |
| k-beauty/deals.html | Best K-Beauty Deals \| Korean Skincare Deals | ✓ | ✓ |
| 기타 15개 페이지 | 페이지별 최적화 완료 | ✓ | ✓ |

---

## 5. 경로 검증 결과

- 깨진 내부 링크: **0개**
- CSS/JS 경로: **모두 정상**
- 이미지 경로: **모두 정상** (`assets/img` → `assets/images` 통일 완료)
- `../kimpact-group/` 참조: **모두 `../index.html`로 수정 완료**
- `../shared/` 참조: **root 기준 `shared/`로 수정 완료**

---

*K-IMPACT Media Group | contact@kimpactmedia.com*
