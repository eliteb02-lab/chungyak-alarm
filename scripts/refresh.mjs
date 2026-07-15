// 청약홈 최신 분양공고를 받아 chungyak_data.json 을 갱신한다.
// GitHub Actions에서 매일 실행. API 키는 Actions Secret(CHUNGYAK_API_KEY)에서 읽는다.
import { writeFileSync } from 'node:fs';

const KEY = process.env.CHUNGYAK_API_KEY;
if (!KEY) { console.error('CHUNGYAK_API_KEY 가 없습니다.'); process.exit(1); }

const API = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail';
const url = `${API}?page=1&perPage=100&serviceKey=${encodeURIComponent(KEY)}`;

const s = v => (v == null ? '' : String(v)).slice(0, 10);
const typeOf = r => r.HOUSE_SECD_NM === 'APT'
  ? (r.HOUSE_DTL_SECD_NM === '국민' ? '공공' : (r.HOUSE_DTL_SECD_NM || '민영'))
  : (r.HOUSE_SECD_NM || r.HOUSE_DTL_SECD_NM || '민영');

const res = await fetch(url);
if (!res.ok) { console.error('HTTP ' + res.status); process.exit(1); }
const json = await res.json();
const rows = json.data || [];
if (!rows.length) { console.error('데이터 없음 — 기존 파일 유지'); process.exit(1); }

const data = rows.map(r => ({
  name: r.HOUSE_NM || '(단지명 미상)',
  region: r.SUBSCRPT_AREA_CODE_NM || '-',
  addr: r.HSSPLY_ADRES || '-',
  type: typeOf(r),
  units: parseInt(r.TOT_SUPLY_HSHLDCO) || 0,
  notice: s(r.RCRIT_PBLANC_DE),
  rcBgn: s(r.RCEPT_BGNDE || r.SUBSCRPT_RCEPT_BGNDE),
  rcEnd: s(r.RCEPT_ENDDE || r.SUBSCRPT_RCEPT_ENDDE),
  win: s(r.PRZWNER_PRESNATN_DE),
  dev: r.CNSTRCT_ENTRPS_NM || r.BSNS_MBY_NM || '-',
  tel: r.MDHS_TELNO || '-',
  url: r.PBLANC_URL || r.HMPG_ADRES || 'https://www.applyhome.co.kr'
})).filter(x => x.rcEnd);

const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); // KST
const out = { updatedAt: today, source: '한국부동산원 청약홈 (공공데이터포털)', data };
writeFileSync('chungyak_data.json', JSON.stringify(out, null, 2) + '\n');
console.log(`갱신 완료: ${data.length}건 · ${today}`);
