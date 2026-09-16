# Ekran görüntüsü aracı

Canlı bir adresin masaüstü ve mobil ekran görüntüsünü alır, istenirse siteye
yükleyip vitrin galerisine yapıştırılacak adresleri basar.

Bağımlılık repoya girmiyor: Puppeteer'ın resmi image'i kullanılıyor, `front`
paketine bir şey eklenmedi, CI etkilenmiyor.

## Çalıştırma

PowerShell:

```powershell
docker run --rm `
  -v "${PWD}\tools\screenshots:/work:ro" `
  -v "${PWD}\shots:/out" `
  ghcr.io/puppeteer/puppeteer:23.11.1 `
  node /work/capture.mjs --url https://korede.com.tr --name korede
```

Çıktı `shots/korede-desktop.webp` ve `shots/korede-mobile.webp`.

## Seçenekler

| Seçenek | Varsayılan | Açıklama |
| --- | --- | --- |
| `--url` | (zorunlu) | Görüntüsü alınacak adres |
| `--name` | alan adından türetilir | Dosya adı öneki |
| `--out` | `/out` | Container içindeki çıktı dizini |
| `--wait` | `1500` | Sayfa yüklendikten sonra beklenecek ms (animasyon bitsin diye) |
| `--full` | kapalı | Sayfanın tamamını al, sadece ilk ekranı değil |
| `--upload` | kapalı | Görselleri siteye yükle, `/api/media/...` adreslerini bas |

Ölçüler: masaüstü 1440x900 (2x), mobil 390x844 (3x).

## Doğrudan yükleme

`--upload` görselleri **canlı siteye** yazar. Kimlik bilgileri yalnızca ortam
değişkeninden okunur, komut satırına yazılmaz.

```powershell
docker run --rm `
  -v "${PWD}\tools\screenshots:/work:ro" `
  -v "${PWD}\shots:/out" `
  -e SITE_URL=https://kemalkondakci.me `
  -e ADMIN_USERNAME=$env:ADMIN_USERNAME `
  -e ADMIN_PASSWORD=$env:ADMIN_PASSWORD `
  ghcr.io/puppeteer/puppeteer:23.11.1 `
  node /work/capture.mjs --url https://korede.com.tr --name korede --upload
```

Basılan `/api/media/...` adresleri admin panelde **Projeler > Vitrin galerisi**
alanındaki kutuya yapıştırılır.

## Yerel siteyi çekmek

Container içinden `localhost` kendi container'ı gösterir. Windows'ta geliştirme
sunucusuna bakmak için `--url http://host.docker.internal:3000` kullan.
