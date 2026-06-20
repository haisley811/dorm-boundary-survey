@echo off
cd /d "%~dp0"

set HTTP_PROXY=
set HTTPS_PROXY=
set http_proxy=
set https_proxy=
set npm_config_proxy=
set npm_config_https_proxy=
set PORT=3000

echo.
echo ==================================================
echo  Dorm Boundary Survey - Local Preview
echo ==================================================
echo.
echo This window starts your local website.
echo Keep this black window open while using the website.
echo Close this window when you want to stop the website.
echo.

if not exist ".env.local" (
  echo WARNING: .env.local was not found.
  echo Admin password and Supabase saving will not work until you create it.
  echo.
)

echo Step 1/4: checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "127.0.0.1:3000" ^| findstr "LISTENING"') do (
  echo Port 3000 is already used by old process %%a. Trying to close it...
  taskkill /PID %%a /F >nul 2>nul
)

timeout /t 2 /nobreak >nul

for /f "tokens=5" %%a in ('netstat -ano ^| findstr "127.0.0.1:3000" ^| findstr "LISTENING"') do (
  echo Port 3000 is still busy, so this preview will use port 3001.
  set PORT=3001
)

echo.
echo Website address:
echo http://127.0.0.1:%PORT%
echo.

echo Step 2/4: clearing old Next.js cache...
if exist ".next" (
  rmdir /s /q ".next"
)

echo Step 3/4: preparing the website...
echo This may take 20-60 seconds.
call npm run build
if errorlevel 1 (
  echo.
  echo Build failed. Please send Codex a screenshot of this black window.
  echo.
  pause
  exit /b 1
)

echo.
echo Step 4/4: starting the website...
echo.
echo When you see "Ready", open or refresh:
echo http://127.0.0.1:%PORT%
echo.

node "node_modules\next\dist\bin\next" start --hostname 127.0.0.1 --port %PORT%

echo.
echo The website stopped.
echo If this was unexpected, send Codex a screenshot of this black window.
echo.
pause
