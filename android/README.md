LABEXPRESS-LIS Android App (Kotlin)

This folder contains a scaffold for the LABEXPRESS-LIS Android application using Kotlin + MVVM.

Setup (short):
- Open Android Studio
- Import project as Gradle project (create new Android module and copy files under `app/src/main/java` accordingly)
- Add dependencies: Retrofit, OkHttp, Coroutines, Lifecycle (ViewModel), CameraX or ZXing for QR scanning, Play Services Location.

This scaffold provides:
- Retrofit API interfaces (`ApiService.kt`)
- Network module (`NetworkModule.kt`)
- Models (`model/`)
- Repository (`repository/`)
- ViewModels (`viewmodel/`)
- Basic Activities for Login, Flebotomist Dashboard, QR Scanner and Patient Dashboard.

Security notes:
- Store token securely (use EncryptedSharedPreferences or Android Keystore for production). The scaffold uses simple SharedPreferences placeholders.
