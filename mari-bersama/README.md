# Mari Bersama: Panduan Firebase & Ujian

Tanpa config, app berjalan dalam **mod demo** (data dalam peranti sahaja). Ikut langkah di bawah untuk jadikan ia **online** supaya orang lain boleh cuba.

## 1. Cipta projek Firebase (percuma, pelan Spark)
1. Buka https://console.firebase.google.com → **Add project** → beri nama (cth `mari-bersama`). Google Analytics boleh dimatikan.
2. Dalam projek, klik ikon **`</>` (Web)** → daftar app → **salin objek `firebaseConfig`**.

## 2. Aktifkan log masuk
**Build → Authentication → Get started → Sign-in method**, aktifkan tiga-tiganya:
- **Google**: pilih e-mel sokongan projek, Save.
- **Email/Password**: app guna ini untuk "Daftar ID" (ID ditukar kepada `id@mari-bersama.app` di belakang tabir).
- **Anonymous**: untuk mod Tetamu.

## 3. Cipta pangkalan data
**Build → Firestore Database → Create database** → pilih lokasi (cadangan `asia-southeast1` Singapore) → mula dalam **Production mode**.
Kemudian tab **Rules** → tampal seluruh isi `firestore.rules` → **Publish**.
(Kalau Firebase beritahu ada ralat sintaks dalam rules, hantar mesej ralat itu kepada saya.)

## 4. Masukkan config dalam app
Buka `public/index.html`, cari `FIREBASE_CONFIG` (berhampiran permulaan skrip) dan isi nilai daripada langkah 1:
```js
const FIREBASE_CONFIG={
  apiKey:'...',
  authDomain:'...firebaseapp.com',
  projectId:'...',
  storageBucket:'...',
  messagingSenderId:'...',
  appId:'...'
};
```
`apiKey` Firebase bukan rahsia. Keselamatan dijaga oleh `firestore.rules`.

## 5. Hos supaya orang lain boleh cuba
**Cara A: Firebase Hosting (cadangan)**: dapat pautan `https://NAMA-PROJEK.web.app`, domain ini sudah dibenarkan automatik untuk Google Sign-in.
```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pilih projek anda
firebase deploy           # hantar website + rules sekali gus
```
**Cara B: tanpa terminal**: seret folder `public` ke https://app.netlify.com/drop untuk dapat pautan. Kemudian tambah domain pautan itu di **Authentication → Settings → Authorized domains**, kalau tidak Google Sign-in akan ditolak.

Bagi pautan itu kepada penguji.

## 6. Senarai semak ujian
- [ ] Main sebagai **Tetamu** → main satu permainan → PTS bertambah.
- [ ] **Daftar ID** → log keluar → log masuk semula → PTS kekal.
- [ ] **Log masuk Google** (guna Chrome/Safari, bukan pelayar dalam WhatsApp/Facebook).
- [ ] Dua peranti/akaun berbeza → **Ranking** papar kedua-duanya.
- [ ] Tukar nama, bio, gambar → muat semula halaman → kekal.
- [ ] **Tetapan → Laporkan** → semak koleksi `reports` di Firestore Console.

## 7. Pasang di skrin utama (app)
Mesti buka melalui pautan **https** (Firebase Hosting / Netlify). Fail `index.html` yang dibuka terus dari peranti tidak boleh dipasang.

- **Android (Chrome):** buka pautan → menu ⋮ → **Pasang aplikasi** / **Tambah ke skrin utama**.
- **iPhone (Safari sahaja):** buka pautan → butang **Kongsi** → **Tambah ke Skrin Utama**.
- **Komputer (Chrome/Edge):** ikon pasang di hujung bar alamat.

Selepas dipasang: ikon logo, skrin penuh tanpa bar pelayar, dan boleh dimainkan tanpa internet selepas dibuka sekali dengan internet.

**Bila kemas kini website:** tukar `VERSI` dalam `public/sw.js` (cth `mb-v2`) sebelum deploy supaya peranti penguji dapat versi baharu. App akan ambil versi baharu bila dibuka dengan internet.

## 8. Kemas kini subjek baharu (WAJIB ikut turutan ini)
Subjek ditambah: Bahasa Melayu, Bahasa Inggeris, Geografi, Pendidikan Islam, Pengetahuan Am (mod Hangman) dan Matematik Tambahan (pilihan A/B/C/D). Slip Keputusan kini ada 11 subjek.

1. **Terbitkan `firestore.rules` yang baharu dahulu**: Firebase Console → Firestore Database → Rules → tampal → **Publish**. Peraturan baharu menerima subjek baharu, dan masih menerima akaun lama.
2. **Kemudian** deploy website (`firebase deploy`, atau seret folder `public` ke Netlify).
3. Muat semula halaman dengan bersih (Ctrl+Shift+R). `VERSI` dalam `sw.js` sudah dinaikkan kepada `mb-v4`.

Kalau langkah 2 dibuat sebelum langkah 1, simpanan skor akan ditolak oleh pelayar kerana peraturan lama tidak mengenali subjek baharu.

## 9. Kemas kini Fasa 1: Ganjaran (WAJIB ikut turutan ini)
Ditambah: syiling 🪙, Achievement dan Badge (20 badge), Daily Streak, Daily Reward (kitaran 7 hari), Gelaran pemain. Tab baharu **Ganjaran** dalam bar bawah.

1. **Terbitkan `firestore.rules` yang baharu dahulu**: Firebase Console → Firestore Database → Rules → tampal → **Publish**.
2. **Kemudian** deploy website. Versi cache `sw.js` sudah dinaikkan kepada `mb-v5`.
3. Muat semula bersih (Ctrl+Shift+R).

Kalau langkah 2 dibuat sebelum langkah 1, simpanan skor dan syiling akan ditolak.

**Cara ia berfungsi**
- Setiap permainan memberi 1 syiling bagi setiap 5 PTS.
- **Daily Reward:** tuntut sekali sehari. Ganjaran 20, 30, 40, 50, 60, 80, 150 syiling mengikut hari streak (kitaran 7 hari).
- **Streak:** bertambah bila pemain bermain atau menuntut ganjaran pada hari berturut-turut (ikut tarikh peranti). Hari terlepas, streak kembali ke 1.
- **Badge:** Langkah Pertama, First 100 PTS, Bintang Muda (500 PTS), Juara Kuiz (1,000 PTS), Genius (semua betul dalam permainan minimum 10 soalan), Kaki Main (10 permainan), Konsisten (streak 3), Rajin Berusaha (streak 7), Serba Boleh (PTS dalam semua subjek) dan 11 Master subjek (300 PTS / Gred A). Setiap badge memberi syiling. Sesetengahnya membuka gelaran (cth "Sejarah Master").
- Pemain sedia ada akan dapat badge secara retroaktif bila mereka log masuk.

**Had (jujur):** syiling dan streak dikira di pelayar, jadi pemain yang mahir boleh menokoknya. Peraturan menghadkan kenaikan syiling maksimum 3000 setiap simpanan dan streak +1 setiap simpanan, tetapi perlindungan penuh perlu Cloud Functions (pelan Blaze). Perlu dibuat sebelum kedai item dibuka.

## 10. Kemas kini v6: Sosial & UI baharu (WAJIB ikut turutan ini)
Ditambah: bar bawah **Home · Game · Post · Inbox · Profil**, menu ☰ (kiri atas) ke Tetapan/Ruang Rakan/Ranking/Ganjaran, mod **Trivia** (ZooPedia, Malaysian Trivia), **Matematik Tambahan** dalam Hangman, **ID awam (@)** boleh ditukar sebulan sekali, **pautan Tetamu ke Google** (di Tetapan, data kekal), profil gaya Facebook (cover photo), **rakan**, **siaran** (suka & komen), **chat**, **Inbox**, **Sekat** dan **Laporkan**.

1. **Terbitkan `firestore.rules` yang baharu DAHULU**: Firebase Console → Firestore Database → Rules → padam semua → tampal → **Publish**.
2. **Kemudian** deploy website (seret folder `public` ke Netlify).
3. Buka `https://NAMA-ANDA.netlify.app/sw.js`, pastikan baris atas ada `mb-v6`. Muat semula bersih (Ctrl+Shift+R).

Nota penting:
- Ciri sosial hanya berfungsi dalam mod **online** (bukan demo).
- Cover photo disimpan sebagai gambar kecil dalam Firestore (tiada Firebase Storage, jadi kekal percuma).
- Rakan boleh menambah satu sama lain melalui **@ID**. Tetamu/Google perlu tetapkan ID awam dahulu (di Ruang Rakan atau Tetapan). Akaun ID mendapat @ID sama dengan ID log masuk secara automatik.
- Siaran hanya dilihat oleh pemilik dan rakan. Chat hanya antara rakan.
- Jika pautan Google gagal kerana akaun Google itu sudah wujud, log keluar dan log masuk dengan Google (data tetamu tidak digabungkan).
- Admin baca laporan di koleksi `reports` (kini ada medan `type` dan `ref`).

## 11. Kemas kini v7: UI baharu (tiada perubahan peraturan)
Tema gelap yang lebih kemas, ikon SVG seragam menggantikan emoji, avatar ilustrasi (termasuk pilihan bertudung), dan **Ranking Online + Ranking Rakan** kini di tab **Game**.
1. `firestore.rules` **tidak berubah** daripada v6. Jika v6 sudah diterbitkan, tiada apa perlu dibuat.
2. Deploy folder `public`, kemudian pastikan `/sw.js` ada `mb-v7` dan muat semula bersih (Ctrl+Shift+R).
3. Pengguna lama yang menggunakan avatar emoji kekal dengan emoji itu sehingga mereka memilih avatar baharu.

## 12. Kemas kini v8: Versus 1v1 (WAJIB ikut turutan ini)
Ditambah: **Versus 1v1** (Game → Versus 1v1). Cabar rakan melalui senarai rakan atau @ID, pilih subjek (Maths, Mat. Tambahan, ZooPedia, Malaysian Trivia, Teka Bendera), 10 soalan, 15 saat setiap soalan. Kedua-dua pemain menjawab soalan yang sama serentak dan nampak kemajuan lawan. Keputusan papar markah, perbandingan setiap soalan, PTS dan syiling (menang +20 syiling), rekod menang/kalah/seri, dan **Rematch**. Tab **Menang 1v1** ditambah dalam Ranking.

1. **Terbitkan `firestore.rules` yang baharu DAHULU** (peraturan `matches`, rekod 1v1 dan medan `vw/vl/vd` baharu): Firestore → Rules → padam semua → tampal → **Publish**.
2. **Kemudian** deploy folder `public`. Pastikan `/sw.js` ada `mb-v8`, kemudian Ctrl+Shift+R.

Nota: cabaran hanya antara **rakan**. Cabaran tamat selepas 24 jam, perlawanan yang tergantung selepas 1 jam. Jika lawan tidak menghabiskan soalan, butang "Tuntut keputusan" muncul selepas 60 saat. Tiada indeks Firestore tambahan diperlukan.

**Had (jujur):** markah dikira di pelayar dan jawapan betul disimpan dalam dokumen perlawanan, jadi pemain yang tahu teknik boleh menipu. Sesuai untuk permainan antara rakan, tetapi Ranking Menang 1v1 belum boleh dipercayai sepenuhnya sehingga ada Cloud Functions (pelan Blaze).

## Had semasa (jujur)
- **Anti-cheat belum penuh.** Peraturan menghadkan mata maksimum 600 setiap simpanan dan mata tidak boleh turun, tetapi pemain yang tahu teknik boleh menokok mata. Perlindungan sebenar memerlukan Cloud Functions (pelan Blaze). Sesuai untuk fasa ujian.
- **Tiada tetapan semula kata laluan** untuk akaun ID (kerana e-mel palsu). Penguji yang lupa kata laluan perlu daftar ID baru, atau guna Google.
- **Akaun Tetamu** hilang jika log keluar atau data pelayar dipadam.
- Ranking papar 30 teratas dan kedudukan anda sendiri.
- Mod offline: app boleh dibuka dan Hangman, Maths dan Bendera boleh dimain, tetapi log masuk, ranking dan report perlukan internet. Jika app dibuka tanpa internet, ia jatuh ke mod demo tempatan selepas ~10 saat, jadi PTS yang dimain ketika itu **tidak masuk akaun online atau ranking**. Penyegerakan skor offline belum ada (boleh ditambah kemudian).
- Avatar berlapis, kedai dan Versus 2v2 belum ada. Ia memerlukan bilik masa nyata (kemas kini seterusnya).
- Kos: pelan percuma memadai untuk ratusan penguji (Firestore: 50,000 bacaan/hari).
