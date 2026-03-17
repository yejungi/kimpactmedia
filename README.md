# K-IMPACT Media Group — Official Website

**K-IMPACT Media Group** 및 **K-Beauty Intelligence Platform** 공식 웹사이트 소스코드입니다.

## 사이트 구조

```
/
├── index.html          ← K-IMPACT Media Group 메인
├── ceo.html            ← CEO 프로필 페이지
├── sitemap.xml
├── robots.txt
├── vercel.json         ← Vercel 배포 설정
├── assets/
│   ├── css/style.css
│   ├── js/i18n.js
│   ├── js/main.js
│   └── images/
│
└── k-beauty/
    ├── index.html      ← K-Beauty Intelligence 메인
    ├── privacy.html    ← 개인정보처리방침
    ├── terms.html      ← 이용약관
    ├── about.html
    ├── contact.html
    └── assets/
```

## 배포 방법 (Vercel)

1. 이 저장소를 Vercel에서 Import
2. Framework Preset: **Other** 선택
3. Root Directory: `/` (기본값 유지)
4. Deploy 클릭 → 자동 배포 완료

## 도메인 연결 (kimpactmedia.com)

| 레코드 타입 | 호스트 | 값 |
|---|---|---|
| A Record | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- 다국어 지원 (한국어, 영어, 일본어, 중국어, 아랍어)
- 반응형 디자인 (모바일 / 태블릿 / 데스크톱)
- SEO 최적화 (sitemap.xml, robots.txt, Open Graph)
