@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "FOUND="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:"0.0.0.0:3000 .*LISTENING" /C:"127.0.0.1:3000 .*LISTENING" /C:"\[::\]:3000 .*LISTENING"') do (
  set "FOUND=1"
  echo [EasyWay] Arret du serveur sur le port 3000, PID %%P...
  taskkill /PID %%P /T /F >nul
)

if not defined FOUND (
  echo [EasyWay] Aucun serveur n'ecoute sur le port 3000.
  exit /b 0
)

echo [EasyWay] Serveur arrete.

