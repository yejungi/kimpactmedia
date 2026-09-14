# K-IMPACT Media Group — CORPORATE FINAL

## Purpose
This package is the final **Corporate Showroom** for K-IMPACT Media Group.
It is intentionally NOT the K-Beauty newsroom/CMS.

The site is designed to communicate:
- a distinctive media-group identity
- a global-facing vision
- K-Beauty as the first vertical
- Founder authority
- partnership potential
- credibility without unsupported claims

## Final architecture
- `index.html` — K-IMPACT corporate showroom
- `ceo.html` — Founder & CEO profile
- `k-beauty/index.html` — K-Beauty vertical introduction / newsroom gateway
- `assets/styles.css` — self-contained visual system
- `assets/site.js` — intentionally minimal; no repetitive AI-style scroll animations
- `404.html` — branded fallback page for missing URLs
- `CNAME` — custom domain `www.kimpactmedia.com`
- `.nojekyll` — keeps GitHub Pages asset paths predictable
- `robots.txt`
- `sitemap.xml`

## Final editorial/brand decisions
- Keep: `Korea, decoded.`
- Keep: `Beyond headlines.`
- Keep: `We don't just report what happened. We explain why it matters.`
- Keep: `Beauty is no longer just beauty.`
- Keep: `A newsroom instinct. A founder's ambition.`
- Keep: `Build with us.`
- Keep K-Beauty thesis: `다음 K-Beauty 승자를 발견하고, 성장의 이유를 숫자와 취재로 설명합니다.`
- Use `Research & Insight` rather than implying an already-operating intelligence platform.
- Present the separate newsroom as `K-Beauty Newsroom — Coming Soon`.
- Do not add fake rankings, live-data claims, AI engines, partner logos, audience numbers, or unlaunched services.

## Contact
The current working email is intentionally retained in the code.
Before replacing it with `contact@kimpactmedia.com`, first make sure that address actually receives mail (mailbox or forwarding).

## GitHub deployment
Upload the CONTENTS of this folder to the root of the repository serving `kimpactmedia.com`.

Test after deployment:
1. `/`
2. `/ceo.html`
3. `/k-beauty/`
4. `/robots.txt`
5. `/sitemap.xml`
6. mobile layout
7. Contact links

## Search
The package contains canonical URLs, Open Graph metadata, JSON-LD where appropriate, `robots.txt`, and `sitemap.xml`.
These help search engines understand and crawl the site; they do not guarantee indexing or ranking.

## Next build
The real K-Beauty newsroom should be a separate publishing system with CMS, article URLs, bylines, timestamps, categories, search, RSS, article/news sitemaps, corrections policy, and editorial workflows.
