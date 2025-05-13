# Discord Auto-Disconnect Bot

Bot Discord yang secara otomatis memutuskan koneksi semua pengguna dari voice channel pada jam 01:00 WIB.

## Fitur

- Secara otomatis memutuskan koneksi semua pengguna dari voice channel pada jam 01:00 WIB
- Dashboard administrasi dengan tema Discord
- Monitoring voice channel secara real-time
- Log aktivitas lengkap
- Tombol manual untuk memicu disconnect kapan saja
- Mekanisme reconnect otomatis untuk menjaga ketersediaan 24/7

## Cara Menjalankan Bot 24/7

### 1. Menggunakan Fitur "Always On" di Replit

Replit menawarkan fitur "Always On" yang memungkinkan bot Anda berjalan tanpa henti:

1. Klik tombol "Run" di Replit untuk memastikan aplikasi berjalan dengan baik
2. Dari panel kiri, klik tab "Tools" 
3. Cari fitur "Always On" dan aktifkan

Dengan mengaktifkan fitur ini, Replit akan menjaga bot Anda tetap berjalan bahkan ketika Anda tidak membuka dashboard Replit.

### 2. Menggunakan Layanan Hosting Alternatif

Jika Anda membutuhkan lebih banyak sumber daya, Anda bisa mempertimbangkan:

- **Heroku** - Menawarkan tier gratis dengan batasan
- **Railway** - Platform modern untuk men-deploy aplikasi
- **Render** - Layanan hosting dengan tier gratis
- **VPS** seperti DigitalOcean, Linode, atau AWS EC2

### 3. Menggunakan Ping Service

Jika Anda menggunakan layanan hosting yang membuat aplikasi "tidur":

1. Daftarkan aplikasi Anda di layanan seperti UptimeRobot
2. Konfigurasikan untuk melakukan ping ke URL aplikasi setiap beberapa menit
3. Ini akan menjaga aplikasi Anda tetap aktif

## Konfigurasi

Bot memerlukan token Discord yang valid untuk berfungsi dengan benar. Tambahkan token Discord Anda ke file environment:

```
DISCORD_TOKEN=your_discord_bot_token_here
```

## Teknologi yang Digunakan

- **Frontend**: React.js, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Bot**: Discord.js
- **Penjadwalan**: node-schedule

## Memulai Pengembangan

```bash
# Menginstal dependensi
npm install

# Menjalankan server pengembangan
npm run dev
```

Server akan berjalan di `http://localhost:5000`.