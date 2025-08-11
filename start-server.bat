@echo off
echo ========================================
echo    WebGIS Yogyakarta - Local Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python ditemukan, memulai server...
    echo [INFO] Server akan berjalan di: http://localhost:8000
    echo [INFO] Tekan Ctrl+C untuk menghentikan server
    echo.
    echo [INFO] Membuka browser...
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:8000"
    python -m http.server 8000
) else (
    echo [ERROR] Python tidak ditemukan!
    echo.
    echo Silakan install Python terlebih dahulu:
    echo 1. Download dari: https://python.org/downloads
    echo 2. Pastikan mencentang "Add Python to PATH"
    echo 3. Restart command prompt setelah instalasi
    echo.
    echo Alternatif lain:
    echo - Buka file index.html langsung di browser
    echo - Gunakan Visual Studio Code dengan Live Server extension
    echo.
)

pause
