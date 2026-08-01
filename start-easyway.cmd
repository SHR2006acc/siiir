@echo off
setlocal
cd /d "%~dp0"

set "NODE_EXE="
where node.exe >nul 2>nul
if not errorlevel 1 set "NODE_EXE=node.exe"

if not defined NODE_EXE (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  )
)

if not defined NODE_EXE (
  echo [EasyWay] Node.js est introuvable.
  echo Installez Node.js LTS depuis https://nodejs.org puis relancez ce fichier.
  exit /b 1
)

if not exist "node_modules\next\dist\bin\next" (
  echo [EasyWay] Les dependances sont absentes.
  echo Executez pnpm install dans ce dossier, puis relancez ce fichier.
  exit /b 1
)

if not exist ".next\BUILD_ID" (
  echo [EasyWay] La version compilee est absente.
  echo Executez build-easyway.cmd, puis relancez ce fichier.
  exit /b 1
)

echo [EasyWay] Demarrage sur http://localhost:3000
echo [EasyWay] Le site sera aussi accessible sur le reseau Wi-Fi via le port 3000.
echo [EasyWay] Appuyez sur Ctrl+C pour arreter le serveur.
"%NODE_EXE%" "node_modules\next\dist\bin\next" start --hostname 0.0.0.0 --port 3000
