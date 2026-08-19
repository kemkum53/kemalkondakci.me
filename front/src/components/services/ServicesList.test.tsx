import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import ServicesList, { type ServiceCard } from "./ServicesList";

// next/link'i basit bir anchor'a indir (router gerektirmesin).
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function makeService(over: Partial<ServiceCard> = {}): ServiceCard {
  return {
    id: "s1",
    slug: "satis-altyapili-web-sitesi",
    category: "web",
    icon: "🛒",
    nameTr: "Satış Altyapılı Web Sitesi",
    nameEn: "E-commerce Website",
    shortDescTr: "Ürün, sepet ve ödeme akışı olan site.",
    shortDescEn: "Site with catalog, cart and checkout.",
    featuresTr: ["Sanal POS entegrasyonu", "Yönetim paneli"],
    featuresEn: ["Payment gateway", "Admin panel"],
    priceType: "range",
    setupPriceMin: 45000,
    setupPriceMax: 90000,
    monthlyPrice: 2500,
    currency: "TRY",
    priceNoteTr: "KDV hariç",
    priceNoteEn: "VAT excluded",
    deliveryMinDays: 21,
    deliveryMaxDays: 35,
    deliveryNoteTr: "",
    deliveryNoteEn: "",
    references: [{ label: "korede.com.tr", url: "https://korede.com.tr" }],
    tags: ["Next.js", "PostgreSQL"],
    featured: false,
    ...over,
  };
}

function renderList(items: ServiceCard[]) {
  return render(
    <LanguageProvider>
      <ServicesList services={items} />
    </LanguageProvider>
  );
}

describe("ServicesList", () => {
  // Varsayılan dil EN; bu testler Türkçe metne bakıyor.
  beforeEach(() => {
    localStorage.setItem("preferred-language", "tr");
  });

  it("hizmet yoksa boş durum mesajı gösterir", () => {
    renderList([]);
    expect(screen.getByText(/yayında hizmet yok/i)).toBeInTheDocument();
  });

  it("hizmet adını, fiyatını ve teslim süresini gösterir", () => {
    renderList([makeService()]);
    expect(screen.getByText("Satış Altyapılı Web Sitesi")).toBeInTheDocument();
    expect(screen.getByText(/45\.000 - /)).toBeInTheDocument();
    expect(screen.getByText("21 - 35 gün")).toBeInTheDocument();
    expect(screen.getByText("KDV hariç")).toBeInTheDocument();
  });

  it("kapsam maddeleri açılana kadar görünmez", async () => {
    renderList([makeService()]);
    expect(screen.queryByText("Sanal POS entegrasyonu")).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: /neler dahil/i }));
    expect(screen.getByText("Sanal POS entegrasyonu")).toBeInTheDocument();
    expect(screen.getByText("Yönetim paneli")).toBeInTheDocument();
  });

  it("teklif al butonu hizmet adını iletişim formuna taşır", async () => {
    renderList([makeService()]);
    const link = await screen.findByRole("link", { name: /teklif isteyin/i });
    expect(link).toHaveAttribute(
      "href",
      "/contact?subject=Sat%C4%B1%C5%9F%20Altyap%C4%B1l%C4%B1%20Web%20Sitesi"
    );
  });

  it("teklife göre seçilmiş hizmette rakam göstermez", () => {
    renderList([
      makeService({
        priceType: "quote",
        setupPriceMin: null,
        setupPriceMax: null,
        monthlyPrice: null,
      }),
    ]);
    expect(screen.getByText("Teklife göre")).toBeInTheDocument();
    expect(screen.queryByText(/45\.000/)).not.toBeInTheDocument();
  });

  it("kategori filtresi sadece seçili kategoriyi bırakır", async () => {
    renderList([
      makeService(),
      makeService({
        id: "s2",
        slug: "sql-chatbot",
        category: "chatbot",
        nameTr: "Veritabanına Bağlı Chatbot",
        featuresTr: [],
      }),
    ]);
    expect(screen.getByText("Veritabanına Bağlı Chatbot")).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Chatbot & Yapay Zekâ" }));
    expect(screen.getByText("Veritabanına Bağlı Chatbot")).toBeInTheDocument();
    expect(screen.queryByText("Satış Altyapılı Web Sitesi")).not.toBeInTheDocument();
  });

  it("tek kategori varsa filtre çubuğunu göstermez", () => {
    renderList([makeService()]);
    // Rol sorgusu yerine metin: hidrasyon beklemeden de güvenilir.
    expect(screen.queryByText("Tümü")).not.toBeInTheDocument();
  });

  it("referans linkini yeni sekmede açar", async () => {
    renderList([makeService()]);
    const ref = await screen.findByRole("link", { name: /korede\.com\.tr/ });
    expect(ref).toHaveAttribute("href", "https://korede.com.tr");
    expect(ref).toHaveAttribute("target", "_blank");
    expect(ref).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("tek referansta tekil, birden fazlada çoğul başlık kullanır", () => {
    const { unmount } = renderList([makeService()]);
    expect(screen.getByText("Canlı referans")).toBeInTheDocument();
    unmount();

    renderList([
      makeService({
        references: [
          { label: "korede.com.tr", url: "https://korede.com.tr" },
          { label: "evrenselyapi.com.tr", url: "https://evrenselyapi.com.tr" },
        ],
      }),
    ]);
    expect(screen.getByText("Canlı referanslar")).toBeInTheDocument();
    expect(screen.getByText("evrenselyapi.com.tr")).toBeInTheDocument();
  });

  it("fiyatların değişebileceği uyarısını kartlardan önce gösterir", () => {
    renderList([makeService()]);
    expect(screen.getByText(/Fiyatlar değişebilir/)).toBeInTheDocument();
    expect(screen.getByText(/Kesin rakam, ihtiyacınızı konuştuktan sonra/)).toBeInTheDocument();

    // Uyarı, DOM sırasında ilk hizmet kartından önce gelmeli.
    const notice = screen.getByText(/Fiyatlar değişebilir/);
    const card = screen.getByText("Satış Altyapılı Web Sitesi");
    expect(notice.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("hizmet yokken uyarı şeridini göstermez", () => {
    renderList([]);
    expect(screen.queryByText(/Fiyatlar değişebilir/)).not.toBeInTheDocument();
  });

  it("referansı olmayan hizmette referans bloğu çıkmaz", () => {
    renderList([makeService({ references: [] })]);
    expect(screen.queryByText(/Canlı referans/)).not.toBeInTheDocument();
  });
});
