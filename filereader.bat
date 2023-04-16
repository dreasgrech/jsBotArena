@echo off
setlocal enabledelayedexpansion

echo. > output.txt

for /r %%f in (*.html *.js) do (
    set "filename=%%~xf"
    if "!filename:~-1!" NEQ "~" (
        echo ----- >> output.txt
        echo %%f >> output.txt
        type "%%f" >> output.txt
        echo. >> output.txt
        echo ----- >> output.txt
    )
)

endlocal
