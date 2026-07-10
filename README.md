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
