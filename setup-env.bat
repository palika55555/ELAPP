@echo off
echo Nastavenie GitHub token pre automatické aktualizácie...
echo.
echo Prosím vložte váš GitHub Personal Access Token:
set /p GH_TOKEN="Token: "
echo.
echo Nastavujem environment premennú...
setx GH_TOKEN "%GH_TOKEN%"
echo.
echo Token bol nastavený. Reštartujte terminal aby sa zmeny prejavili.
echo.
pause
