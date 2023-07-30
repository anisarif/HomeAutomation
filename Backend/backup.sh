
PGPASSWORD="password_db" pg_dump -U admin_db -h localhost home_db > ./db_backup/backup_`date +%Y%m%d_%H%M%S`.sql
