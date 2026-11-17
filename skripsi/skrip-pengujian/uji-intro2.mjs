// Uji fungsional animasi pembuka beranda (versi dengan tombol "Open website"), 14 skenario.
// Pemakaian: node uji-intro2.mjs chromium | node uji-intro2.mjs edge
import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const PERAMBAN = process.argv[2] || 'chromium';
const EXE = PERAMBAN === 'edge' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : process.env.LOCALAPPDATA + '/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const URL = 'http://localhost/iluztar/hostinger/dev/iluztar-personal/public_html/';
const OUT = process.env.OUT || './keluaran';
const TANGKAP = PERAMBAN === 'edge';   // tangkapan layar diambil dari Edge (suara dan codec lengkap)
fs.mkdirSync(OUT, { recursive: true });
const tunggu = ms => new Promise(r => setTimeout(r, ms));
// kebijakan autoplay peramban biasa: suara hanya boleh diputar setelah ada interaksi pengguna
const b = await chromium.launch({ executablePath: EXE, args: ['--autoplay-policy=user-gesture-required'] });
const hasil = { peramban: (PERAMBAN === 'edge' ? 'Microsoft Edge ' : 'Chromium ') + b.version(), tanggal: new Date().toISOString() };

async function konteks(opsi = {}, blokirReel = false) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opsi });
  if (blokirReel) await ctx.route('**/dev/motion/**', r => r.abort());
  const pg = await ctx.newPage(); const galat = [], pesan = [], audio = [], tab = [];
  pg.on('console', m => { if (m.type() === 'error') galat.push(m.text().slice(0, 160)); });
  pg.on('pageerror', e => galat.push('pageerror: ' + e.message.slice(0, 160)));
  pg.on('request', r => { if (/Soundtrack/.test(r.url())) audio.push(r.url().split('/').pop()); });
  ctx.on('page', x => { if (x !== pg) tab.push(x.url()); });
  await pg.exposeFunction('catatPesan', d => pesan.push(d));
  await ctx.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', e => console.error('CSP ' + e.violatedDirective + ' ' + e.blockedURI));
    if (window === window.top) addEventListener('message', e => { try { window.catatPesan(JSON.stringify(e.data)); } catch (_) {} });
    // catat setiap elemen audio yang diputar (di dalam iframe reel)
    window.__aud = []; const asli = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { if (!window.__aud.includes(this)) window.__aud.push(this); return asli.apply(this, arguments); };
  });
  const kondisi = async (fn, batas = 20000) => { const t = Date.now(); while (Date.now() - t < batas) { if (await pg.evaluate(fn).catch(() => false)) return true; await tunggu(100); } return false; };
  const reel = () => pg.frames().find(x => /intro=1/.test(x.url()));
  const waktuReel = async () => { const f = reel(); return f ? +(await f.evaluate(() => (window.__reel && window.__reel.time()) || 0).catch(() => 0)).toFixed(2) : null; };
  const suara = async () => { const f = reel(); return f ? f.evaluate(() => (window.__aud || []).map(a => ({ berkas: a.src.split('/').pop(), berjalan: !a.paused, posisi: +a.currentTime.toFixed(1), bisu: a.muted }))).catch(() => []) : []; };
  return { ctx, pg, galat, pesan, audio, tab, kondisi, waktuReel, suara };
}
const gerbang = () => { const e = document.getElementById('ilz-intro'); return !!e && e.classList.contains('is-gerbang'); };
const tertutup = () => !document.getElementById('ilz-intro');
const aktif = pg => pg.evaluate(() => !!document.getElementById('ilz-intro') && document.documentElement.classList.contains('ilz-intro-aktif'));
const potret = (pg, nama) => TANGKAP ? pg.screenshot({ path: `${OUT}/intro_${nama}.png` }) : null;

// 1–4. alur penuh: loader → tombol → animasi bersuara → halaman utama → kunjungan ulang
{
  const k = await konteks(); const { pg } = k; const t0 = Date.now();
  await pg.goto(URL, { waitUntil: 'domcontentloaded' });
  await tunggu(200); await potret(pg, '1-loader-1440');
  const adaGerbang = await k.kondisi(gerbang); const tGerbang = (Date.now() - t0) / 1000;
  await tunggu(1500); await potret(pg, '2-tombol-1440');
  const diam = await k.waktuReel();                       // sebelum diklik: animasi belum berjalan
  const audioSebelum = (await k.suara()).filter(a => a.berjalan).length;
  const tKlik = Date.now(); await pg.click('.ilz-intro__mulai');
  await tunggu(3000); await potret(pg, '3-reel-1440');
  const jalan3 = await k.waktuReel(); const suara3 = await k.suara();
  await tunggu(9000); await potret(pg, '4-reel-tengah-1440');
  const okTutup = await k.kondisi(tertutup, 45000); const tTutup = (Date.now() - tKlik) / 1000;
  await tunggu(600); await potret(pg, '5-halaman-utama-1440');
  const ss = await pg.evaluate(() => sessionStorage.getItem('ilz-intro'));
  const gulir = await pg.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden' && ![...document.body.children].some(n => n.inert));
  await pg.reload({ waitUntil: 'domcontentloaded' }); await tunggu(500);
  hasil.alur = { tombol_muncul: adaGerbang, tombol_muncul_detik: +tGerbang.toFixed(1), posisi_animasi_sebelum_klik: diam, audio_berjalan_sebelum_klik: audioSebelum,
    posisi_animasi_3s_setelah_klik: jalan3, audio_3s_setelah_klik: suara3, audio_diminta: [...new Set(k.audio)], suara_gagal: k.pesan.some(m => m.includes('suara-gagal')),
    tertutup_otomatis: okTutup, tertutup_detik_setelah_klik: +tTutup.toFixed(1), sessionStorage: ss, halaman_bisa_digulir: gulir, kunjungan_ulang_tanpa_intro: !(await aktif(pg)), galat: k.galat };
  await k.ctx.close();
}
// 5. Lewati pada tahap tombol (animasi belum dimulai)
{
  const k = await konteks(); const { pg } = k;
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await k.kondisi(gerbang); await tunggu(400);
  const fokus = await pg.evaluate(() => document.activeElement && document.activeElement.className);
  const t = Date.now(); await pg.click('.ilz-intro__lewati'); const ok = await k.kondisi(tertutup, 3000);
  hasil.lewati_di_tombol = { fokus_awal: fokus, tertutup: ok, tertutup_ms: Date.now() - t, galat: k.galat };
  await k.ctx.close();
}
// 6. Lewati saat animasi berjalan; 7. Esc
{
  const k = await konteks(); const { pg } = k;
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await k.kondisi(gerbang); await pg.click('.ilz-intro__mulai'); await tunggu(4000);
  const t = Date.now(); await pg.click('.ilz-intro__lewati'); const ok = await k.kondisi(tertutup, 3000);
  hasil.lewati_saat_berjalan = { tertutup: ok, tertutup_ms: Date.now() - t, galat: k.galat };
  await k.ctx.close();
  const e = await konteks();
  await e.pg.goto(URL, { waitUntil: 'domcontentloaded' }); await e.kondisi(gerbang); await e.pg.click('.ilz-intro__mulai'); await tunggu(3000);
  const t2 = Date.now(); await e.pg.keyboard.press('Escape'); const ok2 = await e.kondisi(tertutup, 3000);
  hasil.esc = { tertutup: ok2, tertutup_ms: Date.now() - t2 };
  await e.ctx.close();
}
// 8. reduced motion; 9. ?intro=0
{
  const k = await konteks({ reducedMotion: 'reduce' });
  await k.pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(800);
  hasil.reduced_motion_tanpa_intro = !(await aktif(k.pg)); await k.ctx.close();
  const k2 = await konteks(); await k2.pg.goto(URL + '?intro=0', { waitUntil: 'domcontentloaded' }); await tunggu(800);
  hasil.intro_0_tanpa_intro = !(await aktif(k2.pg)); await k2.ctx.close();
}
// 10. ponsel 390 px
{
  const k = await konteks({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const { pg } = k;
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await tunggu(200); await potret(pg, '6-loader-390');
  const ada = await k.kondisi(gerbang); await tunggu(1200); await potret(pg, '7-tombol-390');
  const kotak = await pg.evaluate(() => { const r = document.querySelector('.ilz-intro__mulai').getBoundingClientRect(); return { lebar: Math.round(r.width), tinggi: Math.round(r.height), di_layar: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; });
  await pg.tap('.ilz-intro__mulai'); await tunggu(3500); await potret(pg, '8-reel-390');
  const jalan = await k.waktuReel();
  const lw = await pg.evaluate(() => { const r = document.querySelector('.ilz-intro__lewati').getBoundingClientRect(); return { lebar: Math.round(r.width), tinggi: Math.round(r.height), di_layar: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; });
  const penuh = await pg.evaluate(() => { const r = document.querySelector('.ilz-intro__reel').getBoundingClientRect(); return Math.round(r.width) === innerWidth && Math.round(r.height) === innerHeight; });
  await pg.tap('.ilz-intro__lewati'); const ok = await k.kondisi(tertutup, 3000); await tunggu(600); await potret(pg, '9-halaman-utama-390');
  hasil.hp = { tombol_muncul: ada, tombol_mulai: kotak, posisi_animasi_setelah_ketuk: jalan, iframe_selayar_penuh: penuh, tombol_lewati: lw, tertutup: ok, galat: k.galat };
  await k.ctx.close();
}
// 11. reel gagal dimuat → pengaman 10 detik
{
  const k = await konteks({}, true); const { pg } = k; const t0 = Date.now();
  await pg.goto(URL, { waitUntil: 'domcontentloaded' });
  const ok = await k.kondisi(tertutup, 16000);
  hasil.pengaman_muat = { tertutup: ok, tertutup_detik: +((Date.now() - t0) / 1000).toFixed(1), halaman_bisa_digulir: await pg.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden') };
  await k.ctx.close();
}
// 13. tombol Sound: membisukan dan menyalakan kembali tanpa menghentikan animasi
{
  const k = await konteks(); const { pg } = k;
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await k.kondisi(gerbang); await pg.click('.ilz-intro__mulai'); await tunggu(3000);
  const awal = { tombol: await pg.getAttribute('.ilz-intro__suara', 'aria-pressed'), audio: await k.suara() };
  await pg.click('.ilz-intro__suara'); await tunggu(1500);
  const bisu = { tombol: await pg.getAttribute('.ilz-intro__suara', 'aria-pressed'), audio: await k.suara(), posisi_animasi: await k.waktuReel() };
  await pg.click('.ilz-intro__suara'); await tunggu(1500);
  const hidup = { tombol: await pg.getAttribute('.ilz-intro__suara', 'aria-pressed'), audio: await k.suara(), posisi_animasi: await k.waktuReel() };
  hasil.tombol_suara = { awal, setelah_dibisukan: bisu, setelah_dinyalakan: hidup, suara_gagal: k.pesan.some(m => m.includes('suara-gagal')), galat: k.galat };
  await k.ctx.close();
}
// 14. "Watch full reel": versi lengkap 71 detik di lapisan yang sama, tanpa tab baru
{
  const k = await konteks(); const { pg } = k;
  await pg.goto(URL, { waitUntil: 'domcontentloaded' }); await k.kondisi(gerbang); await tunggu(500);
  await pg.click('.ilz-intro__penuh'); await tunggu(3000); await potret(pg, '10-reel-lengkap-1440');
  await tunggu(45000);
  hasil.versi_lengkap = { tab_baru: k.tab.length, audio_diminta: [...new Set(k.audio)], posisi_animasi_setelah_48s: await k.waktuReel(), audio: await k.suara(), lapisan_masih_tampil: !!(await pg.$('#ilz-intro')), suara_gagal: k.pesan.some(m => m.includes('suara-gagal')), galat: k.galat };
  await k.ctx.close();
}
await b.close();
// 12. CSP dan konsol: gabungan galat seluruh skenario
hasil.galat_total = [hasil.alur, hasil.lewati_di_tombol, hasil.lewati_saat_berjalan, hasil.hp, hasil.tombol_suara, hasil.versi_lengkap].flatMap(x => x.galat || []);
fs.writeFileSync(`${OUT}/data_uji_intro${PERAMBAN === 'edge' ? '_edge' : ''}.json`, JSON.stringify(hasil, null, 2));
console.log(JSON.stringify(hasil, null, 1));
