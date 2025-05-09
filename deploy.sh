#!/bin/bash

# === Конфигурация ===
HOST="https://server289.hosting.reg.ru:1500/"
USER="u3116032"
PASS="DxWzJ3mL129qwdyv"
REMOTE_DIR="www/platapay.ru"
LOCAL_DIR="dist"

DELETE_FILES="index.html assets Vector.svg vite.svg"

echo "🚀 Начинаю деплой через FTP..."

lftp -u $USER,$PASS $HOST <<EOF
set ftp:list-options -a
set ssl:verify-certificate no
open $HOST
cd $REMOTE_DIR

# Удаление старых файлов
$(for item in $DELETE_FILES; do echo "rm -r $item"; done)

# Загрузка новых файлов
mirror -R --delete --verbose $LOCAL_DIR .

bye
EOF

echo "✅ Деплой завершён!"

