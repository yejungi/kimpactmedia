# K-IMPACT Media Group — Corporate Guide Deployment

이 패키지는 사용자가 제공한 기존 `kimpact_footer_fix` 폴더 구조를 기준으로 다시 정리한 **기업 안내 / Corporate Guide 사이트**입니다.

## 그대로 유지한 핵심 구조
- `index.html`
- `ceo.html`
- `assets/images/`
- `assets/css/`
- `assets/js/`
- `k-beauty/index.html`
- `k-beauty/assets/`
- `robots.txt`
- `sitemap.xml`
- `vercel.json`

## 기존 파일에서 유지한 실제 자산
- K-IMPACT 로고 이미지
- K-Beauty 로고 이미지
- Founder 프로필 이미지
- 네이버 사이트 인증 메타 태그
- Vercel 배포 설정 구조
- Blog / Instagram 연결
- 기존 사업자 표시 정보

## 제거한 기능/페이지
아래는 Corporate Guide 사이트에 필요하지 않거나 실제 운영 기능으로 오해될 수 있어 제외했습니다.
- 로그인 / 회원가입 (`shared/auth.*`)
- K-Beauty Deals
- Intelligence dashboard
- Brands ranking
- Creators database
- Products / Top 100
- Best cleansers / serums / essences / moisturizers / sunscreens
- 미가동 데이터 점수/랭킹/AI 예측 관련 UI
- 실제 운영되지 않는 기부 비율/기관 연동 문구
- 빈 TikTok / YouTube / Threads / X 링크
- 개인정보 입력형 문의 폼

## K-Beauty 뉴스룸
이 사이트는 기업 안내 페이지입니다.
실제 언론사 기사 발행 시스템은 미디어온 등 별도 CMS에서 구축하는 전제로 분리했습니다.

## GitHub 교체 시
현재 Repository에 `CNAME` 또는 `.github/`가 있다면 **삭제하지 말고 유지하세요.**
그 외 기존 웹사이트 콘텐츠는 이 패키지의 구조로 교체하면 됩니다.

## 검색
`robots.txt`, `sitemap.xml`, canonical, Organization/Person schema를 포함합니다.
이는 검색엔진의 크롤링/이해를 돕지만 검색 노출을 보장하지는 않습니다.
