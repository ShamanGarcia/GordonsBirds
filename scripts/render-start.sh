#!/usr/bin/env bash
# Render start command. Keeps the SQLite file and uploaded photos on the
# persistent disk (mounted at $DATA_DIR) so they survive redeploys, since
# everything outside that mount is rebuilt from scratch each deploy.
set -euo pipefail

DATA_DIR="${RENDER_DATA_DIR:-/var/data}"
PHOTOS_DIR="$DATA_DIR/photos"

mkdir -p "$PHOTOS_DIR"

if [ ! -e "public/photos" ]; then
  ln -s "$PHOTOS_DIR" public/photos
elif [ ! -L "public/photos" ]; then
  rm -rf public/photos
  ln -s "$PHOTOS_DIR" public/photos
fi

npx prisma migrate deploy

if [ ! -f "$DATA_DIR/.seeded" ]; then
  npm run db:seed
  touch "$DATA_DIR/.seeded"
fi

exec npm run start
