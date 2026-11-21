# Audit PageSpeed Insights (pengamatan tambahan, subbab 4.4)

Audit dijalankan sekali per tanggal pada beranda https://iluztar.com/ dengan layanan resmi Google PageSpeed Insights, memakai Lighthouse 13.6.0 dan profil ponsel "Moto G Power, Slow 4G". Prosedurnya berbeda dari pengujian utama (Playwright, subbab 3.3.6), jadi angkanya tidak dibandingkan langsung dengan Tabel 4.6.

| Tanggal | Versi website | Performance ponsel / desktop | Ponsel: FCP · LCP · TBT · CLS | Desktop: FCP · LCP · TBT · CLS | Berkas |
|---|---|---|---|---|---|
| 17 Nov 2026 | 0.15.16 | 95 / 94 | 1,1 s · 2,0 s · 140 ms · 0,003 | 0,5 s · 0,9 s · 120 ms · 0,009 | `2026-11-17_PageSpeed_iluztar_ponsel.png`, `2026-11-17_PageSpeed_iluztar_desktop.png` |
| 21 Nov 2026 | 0.17.0 | 94 / 93 | 1,1 s · 1,9 s · 190 ms · 0,002 | 0,4 s · 1,0 s · 130 ms · 0,006 | `psi-0.17.0-mobile-*.png`, `psi-0.17.0-desktop-*.png` |

Accessibility, Best Practices, dan SEO bernilai 100 pada kedua audit.

Laporan asli audit 21 Nov 2026, dapat dibuka selama Google masih menyimpannya:
- Ponsel: https://pagespeed.web.dev/analysis/https-iluztar-com/hkii1eeydm?form_factor=mobile
- Desktop: https://pagespeed.web.dev/analysis/https-iluztar-com/qairakie78?form_factor=desktop

Tangkapan "metrik" menampilkan nilai FCP/LCP/TBT/CLS beserta waktu pengambilan, perangkat emulasi, dan versi Lighthouse yang tertulis di laporan.
