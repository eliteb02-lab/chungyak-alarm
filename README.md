# 청약알리미 (GitHub Pages 배포)

전국 아파트 청약 공고를 보여주고 관심단지 마감 알림을 주는 정적 웹사이트입니다.
데이터는 한국부동산원 청약홈 공공데이터 API에서 매일 자동 갱신됩니다.

## 구성

- `index.html` — 사이트 본체 (같은 폴더의 `chungyak_data.json` 을 읽음)
- `chungyak_data.json` — 청약 공고 데이터 (매일 자동 갱신)
- `scripts/refresh.mjs` — 청약홈 API에서 데이터를 받아 JSON을 다시 쓰는 스크립트
- `.github/workflows/refresh.yml` — 매일 07:00(KST) 스스로 실행되어 데이터 갱신·커밋
- `.nojekyll`, `robots.txt`, `noindex` — Pages 정상 서빙 + 검색 비노출

## 배포 방법 (약 5분)

1. GitHub에서 새 저장소 생성 (예: `chungyak-alarm`). Public 으로.
   - 무료 계정은 Pages URL이 공개지만, 주소가 추측 불가능하고 검색에는 노출되지 않습니다.
2. 이 `web` 폴더 안의 모든 파일을 저장소에 올립니다.
   - 방법 A: 저장소 페이지 → **Add file → Upload files** 로 드래그해 커밋
   - 방법 B (터미널):
     ```
     cd web
     git init && git add -A && git commit -m "init"
     git branch -M main
     git remote add origin https://github.com/<아이디>/chungyak-alarm.git
     git push -u origin main
     ```
3. 저장소 **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `CHUNGYAK_API_KEY`
   - Secret: 공공데이터포털에서 발급받은 청약홈 인증키(Decoding)
4. 저장소 **Settings → Pages**
   - Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save
   - 잠시 뒤 `https://<아이디>.github.io/chungyak-alarm/` 주소가 생깁니다.
5. **Actions** 탭 → `Refresh chungyak data` → **Run workflow** 로 첫 갱신을 즉시 실행(선택).
   - 이후 매일 07:00(KST)에 자동으로 데이터가 갱신됩니다.

## 참고

- API 키는 GitHub Secret 에만 저장되고 사이트 코드/데이터에는 절대 포함되지 않습니다.
- 관심단지·알림 설정은 방문자의 브라우저(localStorage)에 저장됩니다.
- 실제 청약은 청약홈(applyhome.co.kr)에서 진행하세요. 본 사이트는 정보 제공용입니다.
