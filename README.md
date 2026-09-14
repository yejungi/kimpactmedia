# K-IMPACT Media Group — Corporate Guide Site

이 폴더는 기존 K-IMPACT 사이트의 **로고·CEO 사진·색상·기본 디자인 자산을 보존**하면서, 회사 안내페이지로 역할을 재편한 최종본입니다.

## 페이지 역할

이 사이트는 Corporate Site입니다. 회사의 비전, Founder, K-Beauty 버티컬, Partnership과 Contact를 보여줍니다. 실제 기사 발행·검색·기자명·발행일·RSS·뉴스 Sitemap·CMS는 별도의 K-Beauty Newsroom에서 담당합니다.

## 원본에서 제거한 것

현재 실제 운영 여부를 확인할 수 없는 로그인·인증 기능, 다국어 전환 스크립트, 인텔리전스 대시보드와 샘플 점수, 미검증 브랜드 랭킹, 실시간 데이터 표현, AI Trend Engine, 가상의 ESG 기부 프로그램, 샘플 뉴스룸 기사, 작동하지 않는 문의 폼, 존재하지 않는 소셜 링크를 제거했습니다.

## 보존한 것

원본의 K-IMPACT 로고, K-Beauty 로고, CEO 프로필 사진, 네이비·골드 시각 언어, 회사·미션·리더십·K-Beauty·협업이라는 핵심 정보 구조를 유지했습니다.

## 파일 구조

```text
index.html
ceo.html
k-beauty/index.html
assets/css/style.css
assets/images/*
robots.txt
sitemap.xml
CNAME
.nojekyll
```

## GitHub 업로드

이 폴더 안의 **내용물 전체**를 기존 GitHub 저장소 최상위에 업로드합니다. `index.html`이 저장소 최상위에 있어야 합니다. `CNAME`은 `www.kimpactmedia.com`을 유지하기 위한 파일입니다.

배포 후 다음 주소를 확인합니다.

```text
https://www.kimpactmedia.com/
https://www.kimpactmedia.com/ceo.html
https://www.kimpactmedia.com/k-beauty/
https://www.kimpactmedia.com/robots.txt
https://www.kimpactmedia.com/sitemap.xml
```

Contact는 현재 실제 수신 가능한 `yejungi@naver.com`으로 연결되어 있습니다. 도메인 이메일을 실제로 개설한 뒤에만 교체하세요.

## 다음 단계

Corporate Site는 이 버전으로 고정하고, 이후 별도 미디어온 또는 CMS 프로젝트에서 K-Beauty Newsroom을 구축합니다. Newsroom에는 기사 URL, 작성자, 발행일, 검색, RSS, 뉴스 Sitemap, 정정·반론 요청, 광고·협찬 표시와 편집 워크플로를 구현해야 합니다.
