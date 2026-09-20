@echo off
echo ===================================================
echo     Student Management System - MySQL Database
echo ===================================================
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -t student_management_db -e "SELECT id, first_name, last_name, email, department, gpa, status FROM students;"
echo.
echo Launching interactive MySQL prompt (type 'exit' to quit)...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot student_management_db
