# mycalcstool

## 프로젝트
- 도메인: mycalcstool.com
- 한국어 + 영어 유틸리티 계산기 사이트
- Astro 5.x SSG + Tailwind CSS 4.x + Vanilla JS
- 호스팅: Cloudflare Pages
- 목표: 애드센스 + 제휴마케팅 월 100만원

## 코딩 규칙
- Astro 컴포넌트 사용, 계산 로직은 순수 JS
- Tailwind 유틸리티 클래스 사용 (4.x 문법)
- 데이터는 src/data/*.json 분리
- 모든 페이지: SEO 메타태그, JSON-LD, OG태그 필수
- 모바일 퍼스트 반응형 (sm, md, lg 브레이크포인트)
- 한국어 기본, /en/ 경로 영어
- 커밋: feat: / fix: / docs: / style: 접두어

## 보안 원칙
- XSS 방지: 사용자 입력은 반드시 검증/이스케이프
- CSP 헤더 설정 (Cloudflare Pages _headers 파일)
- 하드코딩된 시크릿 금지
- 계산 결과는 클라이언트사이드에서만 처리 (서버 불필요)
- 입력값 범위 검증 필수

## 계산기 목록 (우선순위)
1. 대출 이자 (/loan)
2. 연봉 실수령액 (/salary)
3. 연말정산 환급 (/tax-refund)
4. BMI (/bmi)
5. 복리 (/compound)
6. 칼로리 (/calorie)
7. 퇴직금 (/severance)
8. 출산 예정일 (/due-date)
9. 기초대사량 (/tdee)
10. D-day (/dday)

## 성능 목표
- Lighthouse Performance: 95+
- LCP: < 1.5s, CLS: < 0.05, INP: < 200ms
- JS 번들: < 50KB

## 광고 전략
- 애드센스 승인 전: placeholder 표시
- 페이지당 최대 3개 광고 슬롯
- 제휴마케팅: Phase 3 이후 적용
