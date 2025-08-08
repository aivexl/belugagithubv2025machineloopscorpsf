# Flutter Setup Guide untuk Windows

## 1. Download Flutter SDK
1. Kunjungi: https://docs.flutter.dev/get-started/install/windows
2. Download Flutter SDK (zip file)
3. Extract ke `C:\flutter`

## 2. Setup Environment Variables
1. Buka "System Properties" → "Environment Variables"
2. Di "System Variables", edit "Path"
3. Tambahkan: `C:\flutter\bin`
4. Klik OK

## 3. Install Android Studio
1. Download dari: https://developer.android.com/studio
2. Install dengan default settings
3. Buka Android Studio
4. Install Android SDK (Tools → SDK Manager)
5. Setup Android Emulator (Tools → AVD Manager)

## 4. Verify Installation
Buka Command Prompt baru dan jalankan:
```bash
flutter doctor
```

## 5. Install VS Code Extensions (Optional)
- Flutter
- Dart
- Flutter Widget Snippets

## 6. Create First Flutter App
```bash
flutter create my_first_app
cd my_first_app
flutter run
```

## Troubleshooting
- Jika ada error, jalankan `flutter doctor` untuk melihat masalah
- Pastikan Android SDK terinstall dengan benar
- Restart Command Prompt setelah setup PATH 