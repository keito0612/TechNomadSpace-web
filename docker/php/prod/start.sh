#!/bin/sh
set -e

cd /var/www/html

# ストレージディレクトリの権限を確認
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Laravelのキャッシュを生成（エラーがあっても続行）
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Supervisordを起動
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
