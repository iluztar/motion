// Pengukuran performa (Microsoft Edge, sesi baru dengan cache kosong tiap percobaan):
// FCP, LCP (+ elemen LCP), CLS, TBT (perkiraan dari long task), waktu load, ukuran transfer per jenis berkas.
// Pemakaian: node perf2.mjs lokal | node perf2.mjs live
import { chromium } from '../node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const OUT = process.env.OUT || './keluaran';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const MODE = process.argv[2] || 'lokal';
const N = +(process.env.N || 5);
const L = 'http://localhost/iluztar/hostinger/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const tunggu = ms => new Promise(r => setTimeout(r, ms));
const PROFIL = {
  desktop: { vp: { width: 1440, height: 810 }, cpu: 1, net: null, mobile: false },
  hp: { vp: { width: 390, height: 844 }, cpu: 4, net: { latency: 150, downloadThroughput: 9 * 1024 * 1024 / 8, uploadThroughput: 1.5 * 1024 * 1024 / 8 }, mobile: true },
};
const KONTROL = 'https://iluztar.github.io/motion/__kontrol-video.html';
const HTML_KONTROL = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kontrol video</title>
<style>html,body{margin:0;height:100%;background:#000}video{width:100%;height:100%;object-fit:contain;display:block}</style></head>
<body><video autoplay muted playsinline src="aset/video/ILUZTAR_Video_Explainer_Referensi_2026-09-26.mp4"></video></body></html>`;
const TARGET = MODE === 'lokal' ? {
  reel: { url: L + 'dev/motion/', profil: ['desktop', 'hp'] },
  reel_intro: { url: L + 'dev/motion/?intro=1', profil: ['desktop', 'hp'] },
  beranda_intro: { url: L + 'dev/iluztar-personal/public_html/', profil: ['desktop', 'hp'], gerbang: true },
  beranda_tanpa_intro: { url: L + 'dev/iluztar-personal/public_html/?intro=0', profil: ['desktop', 'hp'] },
  beranda_lama: { url: L, profil: ['desktop', 'hp'] },
} : {
  reel_github: { url: 'https://iluztar.github.io/motion/', profil: ['desktop'] },
  kontrol_video_github: { url: KONTROL, profil: ['desktop'], kontrol: true, lama: 8000 },
  beranda_live_intro: { url: 'https://iluztar.com/', profil: ['desktop'], gerbang: true, hangat: true },
};
const INIT = `window.__m={lcp:0,lcpEl:'',lcpUkuran:0,cls:0,tbt:0,fcp:0};
new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__m.lcp=e.startTime;window.__m.lcpUkuran=e.size;const x=e.element;window.__m.lcpEl=x?(x.tagName.toLowerCase()+(x.id?'#'+x.id:'')+(x.className&&typeof x.className==='string'?'.'+x.className.trim().split(/\\s+/).slice(0,2).join('.'):'')):(e.url||'')}}).observe({type:'largest-contentful-paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__m.cls+=e.value}).observe({type:'layout-shift',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) if(e.name==='first-contentful-paint') window.__m.fcp=e.startTime}).observe({type:'paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__m.tbt+=Math.max(0,e.duration-50)}).observe({type:'longtask',buffered:true});`;
const jenisDari = (mime, url) => /html/.test(mime) ? 'html' : /javascript|ecmascript/.test(mime) ? 'js' : /css/.test(mime) ? 'css' : /image/.test(mime) ? 'gambar' : /font|woff/.test(mime + url) ? 'font' : /video/.test(mime) || /\.mp4/.test(url) ? 'video' : /audio/.test(mime) || /\.m4a/.test(url) ? 'audio' : 'lain';

const b = await chromium.launch({ executablePath: EDGE, args: ['--disable-blink-features=AutomationControlled'] });
const hasil = { peramban: 'Microsoft Edge ' + b.version(), tanggal: new Date().toISOString(), mode: MODE };
for (const [nama, tg] of Object.entries(TARGET)) {
  hasil[nama] = { url: tg.url };
  for (const np of tg.profil) {
    const p = PROFIL[np]; const cob = [];
    for (let i = 0; i < N; i++) {
      const ctx = await b.newContext({ viewport: p.vp, isMobile: p.mobile, hasTouch: p.mobile, ...(MODE === 'live' ? { userAgent: UA } : {}) });
      if (tg.hangat) { const h = await ctx.newPage(); await h.goto(tg.url, { waitUntil: 'domcontentloaded' }).catch(() => {}); await tunggu(6000); await h.close();
        await ctx.addInitScript(() => { try { sessionStorage.removeItem('ilz-intro'); } catch (e) {} }); }
      const pg = await ctx.newPage();
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send('Network.enable');   // sesi baru = cache kosong; cache tidak dimatikan agar berkas yang sama tidak terhitung dua kali
      if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net });
      if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
      const per = {}; let total = 0, nreq = 0;
      const catat = async r => { try { const s = await r.sizes(); const resp = await r.response(); const k = jenisDari((resp && resp.headers()['content-type']) || '', r.url());
        const n = s.responseBodySize + s.responseHeadersSize; if (n <= 0) return; per[k] = (per[k] || 0) + n; total += n; nreq++; } catch (e) {} };
      pg.on('requestfinished', catat);
      if (tg.kontrol) await pg.route(KONTROL, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML_KONTROL }));
      await pg.addInitScript(INIT);
      const t0 = Date.now();
      await pg.goto(tg.url, { waitUntil: 'load', timeout: 60000 });
      let gerbang_ms = null;
      if (tg.gerbang) { // tunggu tombol "Open website" (reel dalam iframe sudah siap)
        const batas = Date.now() + 25000;
        while (Date.now() < batas) { if (await pg.evaluate(() => { const e = document.getElementById('ilz-intro'); return !!e && e.classList.contains('is-gerbang'); }).catch(() => false)) { gerbang_ms = Date.now() - t0; break; } await tunggu(50); }
      }
      await tunggu(tg.lama || 3000);
      const m = await pg.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ...window.__m, load: n.loadEventEnd, dcl: n.domContentLoadedEventEnd }; });
      const kb = n => Math.round(n / 1024);
      const satu = { fcp_ms: Math.round(m.fcp), lcp_ms: Math.round(m.lcp), lcp_elemen: m.lcpEl, cls: +m.cls.toFixed(3), tbt_ms: Math.round(m.tbt), load_ms: Math.round(m.load), transfer_kb: kb(total), request: nreq,
        per_jenis_kb: Object.fromEntries(Object.entries(per).map(([k, v]) => [k, kb(v)])) };
      if (tg.gerbang) {
        satu.gerbang_ms = gerbang_ms;
        if (gerbang_ms !== null) { // sesudah tombol ditekan: soundtrack ikut dimuat
          await pg.click('.ilz-intro__mulai').catch(() => {}); await tunggu(5000);
          satu.transfer_setelah_mulai_kb = kb(total); satu.audio_setelah_mulai_kb = kb(per.audio || 0);
        }
      }
      if (tg.kontrol) satu.video = await pg.evaluate(() => { const v = document.querySelector('video'); return { diputar_detik: +v.currentTime.toFixed(1), buffer_detik: v.buffered.length ? +v.buffered.end(v.buffered.length - 1).toFixed(1) : 0, lebar: v.videoWidth }; });
      cob.push(satu);
      await ctx.close();
    }
    const angka = Object.keys(cob[0]).filter(k => typeof cob[0][k] === 'number');
    const rata = Object.fromEntries(angka.map(k => [k, +(cob.reduce((s, x) => s + (x[k] || 0), 0) / cob.length).toFixed(k === 'cls' ? 3 : 0)]));
    const jenis = [...new Set(cob.flatMap(x => Object.keys(x.per_jenis_kb)))];
    rata.per_jenis_kb = Object.fromEntries(jenis.map(k => [k, Math.round(cob.reduce((s, x) => s + (x.per_jenis_kb[k] || 0), 0) / cob.length)]));
    rata.lcp_elemen = cob[0].lcp_elemen;
    hasil[nama][np] = { rata_rata: rata, per_percobaan: cob };
    console.log(nama, np, JSON.stringify(rata));
  }
}
await b.close();
fs.writeFileSync(`${OUT}/data_performa${MODE === 'live' ? '_live' : ''}.json`, JSON.stringify(hasil, null, 2));
