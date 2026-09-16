# Showcase (alan bazlı vitrin), plan

Müşteriye doğrudan gönderilebilen, çalışma alanına göre ayrışan vitrin sayfaları.
`/showcase/web`, `/showcase/ai`, `/showcase/devops`, `/showcase/automation`.

## Kararlar

- **Yapı:** alan başına ayrı sayfa. `/showcase` alan seçimi, `/showcase/[area]` vitrin.
- **İçerik:** mevcut `projects` tablosu genişletildi (kategori, galeri, sonuç maddeleri,
  rol, müşteri adı). Ayrı tablo açılmadı, tek içerik havuzu.
- **Taksonomi:** `services` ve `projects` aynı kategori anahtarlarını kullanır
  (`web`, `ai`, `automation`, `devops`, `other`). Böylece bir vitrin sayfası hem
  vakaları hem o alanın fiyatlı hizmetlerini aynı sayfada gösterebiliyor.
  Eski `chatbot` anahtarı migration ile `ai` oldu.
- **Görseller:** admin panelden çoklu yükleme + başlık. Canlı URL'si olan projeler için
  `tools/screenshots` altında Docker ile çalışan ekran görüntüsü aracı.
- **Hero metinleri:** `front/src/lib/showcase.ts` içinde sabit (TR/EN). Nadiren değişir,
  değişince commit gerekir. Vaka ve fiyat içeriği DB'den gelir.
- **PDF:** kapsam dışı. Şimdilik sadece web.

## Adımlar

- [x] 1. API: ortak kategori modülü, `projects` modeline yeni alanlar
- [x] 2. API: şemalar (galeri, sonuçlar, rol, müşteri) + kategori filtresi
- [x] 3. API: migration 0004 (yeni sütunlar + chatbot -> ai)
- [x] 4. API: testler
- [x] 5. Front: ortak kategori modülü, projects tipleri
- [x] 6. Front: `/showcase` ve `/showcase/[area]` sayfaları + CSS
- [x] 7. Front: galeri ve lightbox bileşeni
- [x] 8. Admin: proje formuna yeni alanlar + çoklu görsel yükleme
- [x] 9. Navbar, sitemap, çeviriler
- [x] 10. Front testleri
- [x] 11. `tools/screenshots` ekran görüntüsü aracı

## Canlıdan içerik aktarımı

Hizmetler ve projeler canlı siteden çekildi (`https://kemalkondakci.me/api/services`
ve `/api/projects`, yalnızca okuma). Kapak görselleri indirilip yerel yükleme
dizinine yeniden yüklendi.

Kategori ataması `0005_project_categories` migration'ında duruyor. Bu olmadan
dağıtımdan sonra bütün projeler `other` kalır ve vitrin sayfaları boş açılır.
Yeni proje eklendiğinde kategori admin panelden seçilir, migration'a dokunmak
gerekmez.

## Fiyatların kaldırılması

Hizmet sayfasında rakam yazmıyor. Fiyat, kapsam konuşulduktan sonra yazılı
teklifle veriliyor. `price_type`, `setup_price_*`, `monthly_price`, `currency`
ve `price_note_*` sütunları `0006_drop_service_prices` ile düşürüldü.

Dağıtımdan önce veritabanı yedeği al: migration sütunları düşürür, içindeki
rakamlar geri gelmez. Downgrade sütunları geri ekler ama boş olarak.
Kaldırılmadan önceki canlı değerler `fiyat-yedegi.json` dosyasında (repoya
girmiyor).
