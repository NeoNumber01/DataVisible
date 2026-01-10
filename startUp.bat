@echo off
chcp 65001 >nul
title DataVisible - 数据可视化平台

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     DataVisible - 数据可视化平台         ║
echo  ╚══════════════════════════════════════════╝
echo.

:: 获取当前脚本所在目录
cd /d "%~dp0"

:: 检查是否有 Python
where python >nul 2>&1
if %errorlevel%==0 (
    echo [√] 正在启动本地服务器...
    echo [√] 浏览器将自动打开 http://localhost:8080
    echo.
    echo [!] 按 Ctrl+C 可停止服务器
    echo.
    
    :: 延迟打开浏览器
    start "" cmd /c "timeout /t 2 >nul && start http://localhost:8080"
    
    :: 启动 Python HTTP 服务器
    python -m http.server 8080
) else (
    echo [!] 未检测到 Python，将直接打开 HTML 文件
    echo [!] 部分功能可能受限，建议安装 Python
    echo.
    start "" "%~dp0index.html"
)

pause
