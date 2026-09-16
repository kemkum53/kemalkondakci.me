// Showcase areas. One page per work area, sendable to a client as a single link.
// Case studies, pictures and pricing come from the database; the copy below is
// the part that rarely changes, so it lives in the repo.
import { CATEGORY_ACCENTS, type WorkCategory } from "@/lib/categories";
import type { Lang } from "@/lib/translations";

export type ShowcaseCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  pills: string[];
  casesTitle: string;
  casesEmpty: string;
  metaTitle: string;
  metaDescription: string;
};

export type ShowcaseArea = {
  /** URL segment; matches the work category key. */
  slug: WorkCategory;
  accent: string;
  copy: Record<Lang, ShowcaseCopy>;
};

export const SHOWCASE_AREAS: ShowcaseArea[] = [
  {
    slug: "web",
    accent: CATEGORY_ACCENTS.web,
    copy: {
      tr: {
        eyebrow: "Web ve e-ticaret",
        title: "Satış yapan siteler, yönetimi size kalan paneller",
        lead: "Kurumsal site, ürün kataloğu ya da ödeme alan bir mağaza. Tasarımdan sunucusuna kadar tek elden kuruyorum. Teslimden sonra içeriği kendiniz yönetiyorsunuz, her değişiklik için bana dönmeniz gerekmiyor.",
        pills: ["Mobil öncelikli tasarım", "Yönetim paneli dahil", "Teslimde kullanım eğitimi"],
        casesTitle: "Yapılan işler",
        casesEmpty: "Bu alandaki işler yakında burada olacak. O zamana kadar ihtiyacınızı yazarsanız benzer bir örnek gösterebilirim.",
        metaTitle: "Web ve E-ticaret İşleri",
        metaDescription:
          "Kurumsal siteler, ürün katalogları ve ödeme alan mağazalar. Yapılan işler, ekran görüntüleri ve fiyatlarıyla.",
      },
      en: {
        eyebrow: "Web and e-commerce",
        title: "Sites that sell, panels you run yourself",
        lead: "A company site, a product catalogue or a shop that takes payments. I build it end to end, design through to the server. After handover you manage the content yourself instead of coming back to me for every change.",
        pills: ["Mobile-first design", "Admin panel included", "Training at handover"],
        casesTitle: "Selected work",
        casesEmpty: "Work in this area is coming here soon. In the meantime, tell me what you need and I can show you something similar.",
        metaTitle: "Web and E-commerce Work",
        metaDescription:
          "Company sites, product catalogues and shops that take payments. Case studies, screenshots and pricing.",
      },
    },
  },
  {
    slug: "ai",
    accent: CATEGORY_ACCENTS.ai,
    copy: {
      tr: {
        eyebrow: "Yapay zekâ ve chatbot",
        title: "Kendi verinizle konuşan sistemler",
        lead: "Ürün kataloğunuz, fiyat listeniz ya da doküman arşiviniz üzerinde çalışan chatbot ve arama sistemleri. Cevaplar sizin verinize bağlanıyor, model kendi kafasından uydurmuyor.",
        pills: ["Kendi verinize bağlı", "WhatsApp ve web", "Cevabın kaynağını gösterir"],
        casesTitle: "Yapılan işler",
        casesEmpty: "Bu alandaki işler yakında burada olacak. Elinizdeki veriyi anlatırsanız neyin mümkün olduğunu söyleyebilirim.",
        metaTitle: "Yapay Zekâ ve Chatbot İşleri",
        metaDescription:
          "Kendi veritabanınıza, kataloğunuza veya doküman arşivinize bağlı chatbot ve arama sistemleri.",
      },
      en: {
        eyebrow: "AI and chatbots",
        title: "Systems that answer from your own data",
        lead: "Chatbots and search built on your product catalogue, price list or document archive. Answers are grounded in your data rather than invented by the model.",
        pills: ["Grounded in your data", "WhatsApp and web", "Cites its source"],
        casesTitle: "Selected work",
        casesEmpty: "Work in this area is coming here soon. Describe the data you hold and I can tell you what is possible with it.",
        metaTitle: "AI and Chatbot Work",
        metaDescription:
          "Chatbots and search systems connected to your own database, catalogue or document archive.",
      },
    },
  },
  {
    slug: "automation",
    accent: CATEGORY_ACCENTS.automation,
    copy: {
      tr: {
        eyebrow: "Otomasyon ve entegrasyon",
        title: "Elle yaptığınız işi arka planda yapan akışlar",
        lead: "Sipariş, fatura, stok ve mesaj akışlarını birbirine bağlıyorum. Bir yerden kopyalayıp öbürüne yapıştırdığınız iş, siz dokunmadan işliyor.",
        pills: ["Mevcut programlarınıza bağlanır", "Akış durursa haber verir"],
        casesTitle: "Yapılan işler",
        casesEmpty: "Bu alandaki işler yakında burada olacak. Tekrar eden işinizi anlatırsanız otomatikleşir mi diye bakayım.",
        metaTitle: "Otomasyon ve Entegrasyon İşleri",
        metaDescription:
          "Sipariş, fatura, stok ve mesaj akışlarını birbirine bağlayan otomasyon işleri.",
      },
      en: {
        eyebrow: "Automation and integration",
        title: "Flows that do the manual work in the background",
        lead: "I connect order, invoice, stock and messaging flows to each other. The work you do by copying from one screen into another runs without you touching it.",
        pills: ["Connects to what you already use", "Alerts you when a flow stops"],
        casesTitle: "Selected work",
        casesEmpty: "Work in this area is coming here soon. Describe the repetitive task and I will look at whether it can be automated.",
        metaTitle: "Automation and Integration Work",
        metaDescription:
          "Automation work connecting order, invoice, stock and messaging flows to each other.",
      },
    },
  },
  {
    slug: "devops",
    accent: CATEGORY_ACCENTS.devops,
    copy: {
      tr: {
        eyebrow: "DevOps ve altyapı",
        title: "Sunucusu, yedeği ve dağıtımı düzgün kurulmuş sistemler",
        lead: "Çalışan uygulamanızı container'lara taşıyıp yayına alma sürecini otomatikleştiriyorum. Sunucuya elle dosya atarak güncelleme dönemi kapanıyor.",
        pills: ["Docker ve CI/CD", "Yedek ve geri dönüş testi", "Kesintisiz güncelleme"],
        casesTitle: "Yapılan işler",
        casesEmpty: "Bu alandaki işler yakında burada olacak. Mevcut kurulumunuzu anlatırsanız nereden başlanacağını söyleyebilirim.",
        metaTitle: "DevOps ve Altyapı İşleri",
        metaDescription:
          "Docker'a taşıma, CI/CD kurulumu, yedekleme ve sunucu yönetimi işleri.",
      },
      en: {
        eyebrow: "DevOps and infrastructure",
        title: "Systems with the server, backups and deployment set up properly",
        lead: "I move your running application into containers and automate the path to production. Updating by copying files onto a server comes to an end.",
        pills: ["Docker and CI/CD", "Backups tested by restoring them", "Zero-downtime updates"],
        casesTitle: "Selected work",
        casesEmpty: "Work in this area is coming here soon. Describe your current setup and I can tell you where to start.",
        metaTitle: "DevOps and Infrastructure Work",
        metaDescription:
          "Moving applications to Docker, CI/CD setup, backups and server management.",
      },
    },
  },
];

export function getShowcaseArea(slug: string): ShowcaseArea | undefined {
  return SHOWCASE_AREAS.find((a) => a.slug === slug);
}

/** Copy shared by the index page and every area page. */
export const SHOWCASE_COMMON = {
  tr: {
    indexEyebrow: "Yapılan işler",
    indexTitle: "Hangi alanda çalıştığımı görün",
    indexLead: "Her alanın kendi sayfası var: yapılan işler, ekran görüntüleri ve o alandaki hizmetlerin fiyatları. İlgilendiğiniz alanı seçin.",
    caseCount: (n: number) => (n === 1 ? "1 iş" : `${n} iş`),
    caseCountEmpty: "Yakında",
    open: "İncele",
    backToAreas: "Diğer alanlar",
    role: "Benim rolüm",
    client: "Müşteri",
    results: "Sonuç",
    tech: "Kullanılan teknolojiler",
    gallery: "Görseller",
    detail: "Proje detayı",
    live: "Canlı site",
    repo: "Kaynak kodu",
    servicesTitle: "Bu alandaki hizmetler ve fiyatlar",
    servicesLink: "Fiyat listesinin tamamı",
    ctaTitle: "Benzer bir işe ihtiyacınız varsa",
    ctaText: "Yapmak istediğinizi birkaç cümleyle yazın. Uygulanabilir mi, ne kadar sürer, ne kadar tutar diye bakıp net bir kapsamla dönerim.",
    ctaPrimary: "İhtiyacınızı yazın",
    ctaSecondary: "Fiyatlara bakın",
    close: "Kapat",
    previous: "Önceki görsel",
    next: "Sonraki görsel",
  },
  en: {
    indexEyebrow: "Selected work",
    indexTitle: "See the areas I work in",
    indexLead: "Each area has its own page: the work, the screenshots and what the services in that area cost. Pick the one you are interested in.",
    caseCount: (n: number) => (n === 1 ? "1 project" : `${n} projects`),
    caseCountEmpty: "Coming soon",
    open: "Open",
    backToAreas: "Other areas",
    role: "My role",
    client: "Client",
    results: "Outcome",
    tech: "Built with",
    gallery: "Pictures",
    detail: "Project details",
    live: "Live site",
    repo: "Source code",
    servicesTitle: "Services and pricing in this area",
    servicesLink: "See the full price list",
    ctaTitle: "If you need something similar",
    ctaText: "Describe what you want in a few sentences. I will tell you whether it is feasible, how long it takes and what it costs, with a concrete scope.",
    ctaPrimary: "Tell me what you need",
    ctaSecondary: "See pricing",
    close: "Close",
    previous: "Previous picture",
    next: "Next picture",
  },
} as const;
