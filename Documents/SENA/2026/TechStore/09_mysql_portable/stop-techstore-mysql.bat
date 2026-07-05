@echo off
setlocal

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin.exe" --protocol=tcp --host=127.0.0.1 --port=3308 --user=root --password=TechStore3308 shutdown

endlocal
