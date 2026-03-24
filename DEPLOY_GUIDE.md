# K-IMPACT Media Group — 최종 배포 가이드 (v4 Final)

> 작성일: 2026년 3월 24일 | 버전: v4 Final (redirect loop 완전 해결)

---

## 1. GitHub 업로드 구조

ZIP 압축 해제 후 **내부 파일 전체**를 GitHub 리포지토리 **root**에 바로 업로드합니다.
(ZIP 내부에 상위 폴더 없음 — root 기준으로 바로 업로드 가능)

```
(GitHub root)
├── index.html          ← K-IMPACT Media Group 메인
├── ceo.html            ← CEO 이예정 소개
├── robots.txt          ← 검색엔진 크롤러 설정
├── sitemap.xml         ← 전체 사이트맵 (17개 URL)
├── vercel.json         ← Vercel 배포 설정 (v4 — redirect loop 완전 제거)
├── DEPLOY_GUIDE.md
├── assets/
├── shared/
└── k-beauty/
    ├── index.html
    ├── deals.html
    ├── brands.html
    ├── products.html
    └── (기타 14개 페이지)
```

---

## 2. vercel.json 핵심 설정 (v4)

```json
{
  "version": 2,
  "cleanUrls": false,
  "trailingSlash": false
}
```

- `cleanUrls: false` → /k-beauty/index.html을 /k-beauty/로 강제 변환하지 않음 (redirect loop 원인 제거)
- `trailingSlash: false` → trailing slash 강제 추가 없음 (308 리다이렉트 제거)
- redirects/rewrites 없음 → 충돌 없음

---

## 3. Vercel 배포 절차

1. GitHub에 위 구조로 파일 업로드 (root 기준)
2. vercel.com → New Project → GitHub 리포지토리 연결
3. Framework Preset: **Other** (정적 사이트)
4. Root Directory, Build Command, Output Directory: 모두 기본값(비워둠)
5. Deploy 클릭

---

## 4. 검증 완료 URL (v4 기준 — CSS/JS 완전 로드 확인)

| URL | 상태 |
|-----|------|
| /index.html | ✅ 정상 |
| /ceo.html | ✅ 정상 |
| /k-beauty/index.html | ✅ 정상 |
| /k-beauty/deals.html | ✅ 정상 |
| /k-beauty/brands.html | ✅ 정상 |
| /k-beauty/products.html | ✅ 정상 |

---

## 5. SEO 파일

- robots.txt: www.kimpactmedia.com/sitemap.xml 등록
- sitemap.xml: 17개 URL, www.kimpactmedia.com 기준
- canonical: 전체 페이지 www.kimpactmedia.com 기준 통일
- og:url: 전체 페이지 www.kimpactmedia.com 기준 통일

---

## 6. 배포 후 검색 등록

- Google Search Console: https://www.kimpactmedia.com/sitemap.xml 제출
- 네이버 서치어드바이저: https://www.kimpactmedia.com/sitemap.xml 제출

---

*K-IMPACT Media Group | contact@kimpactmedia.com*
