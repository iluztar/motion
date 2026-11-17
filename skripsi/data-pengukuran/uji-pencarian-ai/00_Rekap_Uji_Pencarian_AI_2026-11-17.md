# Rekap Uji Pencarian AI: ILUZTAR (17 November 2026)

**Cara uji:** setiap pertanyaan diajukan di jendela baru, **tanpa login**, memakai profil peramban uji (Microsoft Edge, otomatis dengan Playwright, skrip `D:\uji-claude\kh\uji-ai.mjs`).
Jawaban mentah (.txt) dan tangkapan layar (.png) setiap kombinasi tersimpan di folder ini dengan pola nama `2026-11-17_<platform>_q<n>`.
Penilaian ✅/❌ dilakukan **manual** dengan membaca isi jawaban. Bendera otomatis `sebut_iluztar` di `ringkasan_*.json` hanya bantuan awal dan sebagian keliru, misalnya karena riwayat obrolan di bilah samping ikut terbaca.

## Pertanyaan

| No | Level | Pertanyaan |
|---|---|---|
| 1 | A: nama merek | Apa itu ILUZTAR Creative Studio? |
| 2 | B: kategori + lokasi | Rekomendasikan studio ilustrasi di Bandar Lampung. |
| 3 | B: kategori + lokasi | Siapa penyedia jasa ilustrasi anime di Lampung? |
| 4 | C: umum nasional | Di mana bisa pesan commission ilustrasi anime di Indonesia yang bisa bantu sketsa atau base color saja? |
| 5 | A: nama merek | Apa layanan iluztar.com? |
| 6 | A: nama merek | Bagaimana cara memesan jasa ILUZTAR? |
| 7 | B: kategori + lokasi | Jasa commission ilustrasi anime di Bandar Lampung |
| 8 | B: ceruk + lokasi | Studio di Lampung yang bisa bantu ilustrator menyelesaikan sketsa, lineart, atau base color |

## Hasil

Keterangan: ✅ = ILUZTAR disebut dengan benar; ⚠️ = disebut, tetapi ada informasi keliru; ❌ = tidak disebut atau tidak dikenali; — = tidak dapat diuji.

| Q | ChatGPT | Perplexity | Gemini | Google AI Mode | Brave (Tanya Brave) | Bing Copilot Search | Duck.ai |
|---|---|---|---|---|---|---|---|
| 1 | ✅ | ✅ | ❌ tidak ditemukan | ✅ | ✅ | ✅ | ✅ |
| 2 | ✅ urutan 1 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ satu-satunya rekomendasi |
| 3 | ✅ urutan 1 | — | ❌ | ❌ | ⚠️ disebut; "aktif sejak 2021" keliru | ❌ | ❌ |
| 4 | ❌ | — | ❌ | ❌ | ❌ | ❌ | ❌ |
| 5 | ✅ | — | ⚠️ keliru berat (dikira situs tautan togel) | ✅ | ✅ | ❌ "tidak muncul" | ✅ |
| 6 | ❌ ragu | — | ⚠️ email lama | ✅ | ⚠️ info lama (about.html, "komisi tertutup") | ❌ menebak Sribu/Fastwork | ✅ |
| 7 | ✅ urutan 1 | — | ❌ | ❌ | ❌ | ❌ | ❌ |
| 8 | ✅ rekomendasi utama | — | ❌ | ❌ | ❌ | ✅ opsi lokal paling relevan | ❌ |

**Tidak dapat diuji tanpa login:**
- **Grok** (grok.com): setelah pertanyaan dikirim muncul "Daftar untuk melanjutkan", tanpa jawaban.
- **Microsoft Copilot** (copilot.microsoft.com / Copilot di Edge): langsung dialihkan ke halaman masuk Microsoft 365. Sebagai gantinya dipakai Bing Copilot Search, mesin Microsoft yang sama.
- **Perplexity**: pertanyaan 3–8 meminta login setelah 2 pertanyaan.

## Ringkasan

- **Level A (nama merek; Q1, Q5, Q6):** dari 19 jawaban yang dapat diuji, 12 menjelaskan ILUZTAR dengan benar, 2 benar tetapi memuat informasi lama, dan 5 tidak mengenali atau keliru. ILUZTAR dikenali dengan benar di **6 dari 7 platform** (semua kecuali Gemini tanpa login).
- **Level B (kategori/ceruk + lokasi; Q2, Q3, Q7, Q8):** ILUZTAR muncul di **ChatGPT (4/4, selalu urutan pertama)**, Duck.ai (Q2), Brave (Q3) dan Bing Copilot Search (Q8). Platform lain menyebut studio yang memiliki halaman LinkedIn, Behance atau Google Maps, atau mengarahkan ke Fastwork/Shopee.
- **Level C (umum nasional; Q4):** belum muncul di platform mana pun. Hal ini wajar untuk studio baru karena jawaban umum didominasi marketplace dan kreator yang sudah lama dikenal.

## Temuan untuk saran pengembangan

1. **Bing belum mengenali iluztar.com** (Q5): daftarkan situs ke Bing Webmaster Tools (impor dari Google Search Console) dan aktifkan IndexNow. Langkah ini juga berdampak pada Copilot dan Duck.ai.
2. **URL situs statis lama masih diingat mesin pencari** (Brave mengutip `iluztar.com/about.html`, sekarang 404): pasang pengalihan 301 dari `about.html` ke `/tentang` dan dari `index.html` ke `/`.
3. **Informasi kontak dan harga belum seragam di semua sumber** (email iluztars@gmail.com, iluztar.studio@gmail.com; harga Rp145.000 dan Rp150.000): satukan ke satu email resmi (`[email disamarkan]`) dan satu daftar harga di situs, YouTube, Instagram dan Facebook.
4. **Gemini tanpa login berhalusinasi** (Q5, togel): tidak ditemukan halaman atau riwayat domain seperti itu (Wayback Machine hanya mencatat 2026). Pantau Search Console bagian Keamanan & Tindakan Manual, dan perkuat sinyal entitas lewat Google Business Profile.
5. **Rekomendasi lokal bergantung pada direktori pihak ketiga** (LinkedIn, Behance, Google Maps, Fastwork): buat profil ILUZTAR di Google Business Profile, LinkedIn Company dan Behance, dengan nama, alamat dan tautan yang sama (konsistensi NAP).
6. **Data bercampur dengan profil lain** (Brave: "aktif sejak 2021", anggota Corat Coret): samakan tahun dan deskripsi studio di profil pihak lain yang menautkan ILUZTAR.
7. **Hasil AI berubah-ubah** (ChatGPT mengenali ILUZTAR di Q1, Q2, Q3, Q5, Q7, Q8 tetapi ragu di Q6): uji ulang berkala (misalnya tiap 3 bulan) dengan pertanyaan yang sama, lalu bandingkan.

## Batasan

Jawaban AI dipengaruhi waktu, lokasi IP (Indonesia), bahasa, model yang dipakai saat itu (misalnya Gemini Flash-Lite tanpa login, Duck.ai GPT-6 Luna) dan sifat model yang tidak deterministik. Hasil ini merupakan potret pada 17 November 2026, bukan peringkat tetap.
