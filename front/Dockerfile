# syntax=docker/dockerfile:1

############################
# 1) Bağımlılıklar
############################
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

############################
# 2) Derleme
############################
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Build sırasında env doğrulaması (session) patlamasın diye geçici placeholder.
ENV SESSION_SECRET="build-time-placeholder-secret-min-32-characters"
# ÖNEMLİ: Next, rewrite hedefini build sırasında manifest'e gömer.
# Bu yüzden /api proxy'sinin backend'e gitmesi için API_URL build-time ayarlanmalı.
ARG API_URL=http://api:8000
ENV API_URL=$API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prebuild TinyMCE asset'lerini public/tinymce'e kopyalar, sonra next build.
RUN npm run build

############################
# 3) Çalıştırıcı
############################
FROM node:20-alpine AS runner
WORKDIR /app
# libc6-compat: Next standalone'un ihtiyac duydugu glibc uyumlulugu.
# apk upgrade: base image sistem paketlerini (ozellikle openssl/libssl3)
#   en guncel yamali surume cikarir -> OS katmani CVE'lerini kapatir.
# npm/npx sil: 'node server.js' calismak icin npm GEREKMEZ (sadece build-time
#   araci). node:20-alpine ile gelen npm, kendi icinde eski tar/glob/minimatch/
#   cross-spawn tasir; bunlari silmek o CVE'leri ve gereksiz saldiri yuzeyini
#   tek seferde kaldirir, image'i da kuculttur.
RUN apk add --no-cache libc6-compat && apk upgrade --no-cache \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Standalone sunucu bu degiskene gore baglanir; Docker icinde disaridan
# erisilebilmesi icin 0.0.0.0 olmali (yoksa sadece localhost'u dinler).
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# 1) Standalone cikti: kendi MINIMAL node_modules'unu + server.js'i icerir.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 2) Statik varliklar (CSS/JS chunk'lari) standalone'a DAHIL DEGIL — ayrica lazim.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 3) public/ (gorseller, TinyMCE asset'leri) de ayrica kopyalanir.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Standalone, "next start" yerine uretilen server.js ile dogrudan baslatilir.
CMD ["node", "server.js"]
