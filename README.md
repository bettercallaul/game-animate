# MBG Food Delivery Game

Browser canvas game bertema pengiriman makanan sekolah. Pemain mengendarai van MBG, mengejar target prioritas, menjaga muatan tetap aman, dan menyelesaikan level sebelum waktu habis.

## Cara menjalankan

```powershell
node serve.js
```

Lalu buka:

```text
http://127.0.0.1:4173/web/
```

## Kontrol

- `WASD` atau tombol panah: gerak
- `Space`: boost
- `P` atau `Esc`: pause

## Isi project

- `web/`: entry HTML, CSS, dan logic game
- `asset/`: sprite, UI, audio, tile, obstacle, dan asset sekolah
- `serve.js`: server lokal sederhana untuk menjalankan game
- `run_browser_game.ps1`: helper PowerShell untuk menjalankan game

## Deploy ke GitHub Pages

Repo ini sudah disiapkan dengan GitHub Actions di `.github/workflows/deploy-pages.yml`.

Setelah repo dipush ke GitHub:

1. Buka **Settings > Pages**
2. Pada **Build and deployment**, pilih **GitHub Actions**
3. Push ke branch `main`, atau jalankan workflow **Deploy GitHub Pages** secara manual

Workflow akan mempublish isi `web/` sebagai root website dan menyalin `asset/` ke output Pages.

## Deploy ke Vercel

Project ini memiliki build teroptimasi untuk Vercel. Build hanya menyertakan aset yang dipakai game, mengecilkan gambar besar, dan mengubah PNG menjadi WebP.

```powershell
npm install
npm run build
npx vercel --prod
```

Konfigurasi deployment berada di `vercel.json`, dengan hasil build di `dist/`.

Production: https://mbg-food-delivery.vercel.app
