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
  exit /b 1
)

if not exist "node_modules\next\dist\bin\next" (
  echo [EasyWay] Les dependances sont absentes. Executez pnpm install.
  exit /b 1
)

echo [EasyWay] Compilation du projet...
"%NODE_EXE%" "node_modules\next\dist\bin\next" build

