#!/usr/bin/env bash
set -e

echo "=== 1. Creating directory structure ==="
mkdir -p /var/www/zoniraz-media/uploads/
echo "media-server-ok" > /var/www/zoniraz-media/uploads/test.txt

echo "=== 2. Configuring Nginx for media.zoniraz.com ==="
cat << 'EOF' > /etc/nginx/sites-available/media.zoniraz.com
server {
    listen 80;
    listen [::]:80;
    server_name media.zoniraz.com;

    root /var/www/zoniraz-media;

    location /uploads/ {
        alias /var/www/zoniraz-media/uploads/;
        autoindex off;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
        try_files $uri $uri/ =404;
    }

    location / {
        return 404;
    }

    location ~ /\. {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/media.zoniraz.com /etc/nginx/sites-enabled/media.zoniraz.com

echo "=== 3. Testing initial Nginx config ==="
nginx -t
systemctl reload nginx

echo "=== 4. Setting permissions ==="
chown -R www-data:www-data /var/www/zoniraz-media
chmod -R 755 /var/www/zoniraz-media
chmod 644 /var/www/zoniraz-media/uploads/test.txt

echo "=== Nginx HTTP Setup Complete ==="
