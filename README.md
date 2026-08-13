# Portofolio — Usamah Abdul Aziz

Dibangun dengan **Next.js 15 (App Router) + JavaScript (bukan TypeScript)** +
**Tailwind CSS v4** + **Sera UI** (komponen Button) + **Framer Motion**.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```
Buka http://localhost:3000

## Struktur konten
Semua copy/teks portofolio ada di `src/lib/data.js` — edit di situ untuk mengubah
pengalaman, proyek, skill, atau sertifikasi tanpa menyentuh komponen.

Komponen halaman ada di `src/components/`:
- `Hero.jsx` — intro + signature waveform (motif Dynamic Time Warping dari skripsi)
- `About.jsx`, `Experience.jsx`, `Projects.jsx`, `Skills.jsx`, `Contact.jsx`
- `ui/button.jsx` — komponen Button dari Sera UI (seraui.com), sudah disesuaikan
  ke palet warna situs ini (pine/amber) dan dikonversi ke JS murni

## Menambah komponen Sera UI lain
Situs Sera UI pakai sistem registry seperti shadcn/ui. Untuk komponen baru
(mis. Tabs, Accordion, Badge), jalankan di mesin lokal kamu (bukan di sandbox ini,
karena domain seraui.com tidak diizinkan di jaringan sandbox):

```bash
npx shadcn@latest add "https://seraui.com/registry/<nama-komponen>.json"
```

Lalu hapus tipe TypeScript dari file yang dihasilkan (ganti ekstensi `.tsx` jadi
`.jsx`, hapus anotasi tipe) — sama seperti yang sudah dilakukan pada `button.jsx`.

## Deploy ke Vercel
1. Push project ini ke GitHub (repo baru).
2. Buka vercel.com -> New Project -> import repo tadi.
3. Vercel otomatis mendeteksi Next.js, tidak perlu ubah konfigurasi apa pun.
4. Klik Deploy -> selesai dalam ~1 menit, dapat URL *.vercel.app gratis.
5. (Opsional) hubungkan domain sendiri di tab Domains pada project Vercel.

## Font
Font self-hosted lewat paket @fontsource (Fraunces, Inter, JetBrains Mono),
tidak bergantung pada Google Fonts CDN saat runtime.
