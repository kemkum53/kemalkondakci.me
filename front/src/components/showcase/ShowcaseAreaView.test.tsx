import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import ShowcaseAreaView, { type CaseView, type ServiceSummary } from "./ShowcaseAreaView";

// next/link'i basit bir anchor'a indir (router gerektirmesin).
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function makeCase(over: Partial<CaseView> = {}): CaseView {
  return {
    slug: "korede",
    name: "Korede Mağaza",
    coverImage: "/api/media/kapak.webp",
    shortDescTr: "Ödeme alan ürün kataloğu.",
    shortDescEn: "Product catalogue with checkout.",
    clientName: "Korede",
    roleTr: "Tasarım, geliştirme, sunucu",
    roleEn: "Design, development, hosting",
    resultsTr: ["Sayfa açılışı 4.1 sn yerine 0.9 sn"],
    resultsEn: ["Page load 4.1s down to 0.9s"],
    gallery: [
      { url: "/api/media/1.webp", captionTr: "Ana sayfa", captionEn: "Home page" },
      { url: "/api/media/2.webp", captionTr: "Sepet", captionEn: "Cart" },
    ],
    techStack: ["Next.js", "PostgreSQL"],
    repoUrl: null,
    liveUrl: "https://korede.com.tr",
    ...over,
  };
}

function makeService(over: Partial<ServiceSummary> = {}): ServiceSummary {
  return {
    id: "s1",
    nameTr: "Satış Altyapılı Web Sitesi",
    nameEn: "E-commerce Website",
    shortDescTr: "Ürün, sepet ve ödeme akışı olan site.",
    shortDescEn: "Site with catalog, cart and checkout.",
    priceType: "from",
    setupPriceMin: 45000,
    setupPriceMax: null,
    monthlyPrice: 2500,
    currency: "TRY",
    ...over,
  };
}

function renderArea(area: string, cases: CaseView[] = [], services: ServiceSummary[] = []) {
  return render(
    <LanguageProvider>
      <ShowcaseAreaView area={area} cases={cases} services={services} />
    </LanguageProvider>
  );
}

/** Sağlayıcı ilk 50 ms boyunca içeriği görünmez tutuyor; rol sorguları o ana kadar boş döner. */
async function galleryThumbs() {
  return screen.findAllByRole("button", { name: /Ana sayfa|Sepet/ });
}

describe("ShowcaseAreaView", () => {
  // Varsayılan dil EN; bu testler Türkçe metne bakıyor.
  beforeEach(() => {
    localStorage.setItem("preferred-language", "tr");
  });

  it("bilinmeyen alanda hiçbir şey basmaz", () => {
    renderArea("uzay");
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
  });

  it("alanın başlığını ve ilerleyiş adımlarını gösterir", async () => {
    renderArea("devops");
    expect(
      await screen.findByRole("heading", {
        name: "Sunucusu, yedeği ve dağıtımı düzgün kurulmuş sistemler",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Taşıma ve otomasyon" })).toBeInTheDocument();
  });

  it("vaka yoksa alana özel boş durum metnini gösterir", () => {
    renderArea("ai");
    expect(screen.getByText(/Bu alandaki işler yakında burada olacak/)).toBeInTheDocument();
  });

  it("vakanın müşterisini, rolünü ve sonucunu basar", async () => {
    renderArea("web", [makeCase()]);
    expect(await screen.findByRole("heading", { name: "Korede Mağaza" })).toBeInTheDocument();
    expect(screen.getByText("Korede")).toBeInTheDocument();
    expect(screen.getByText("Tasarım, geliştirme, sunucu")).toBeInTheDocument();
    expect(screen.getByText("Sayfa açılışı 4.1 sn yerine 0.9 sn")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("dil değişince İngilizce alanlara geçer", () => {
    localStorage.setItem("preferred-language", "en");
    renderArea("web", [makeCase()]);
    expect(screen.getByText("Design, development, hosting")).toBeInTheDocument();
    expect(screen.queryByText("Tasarım, geliştirme, sunucu")).not.toBeInTheDocument();
  });

  it("hizmet fiyatını kart üzerinde gösterir", () => {
    renderArea("web", [], [makeService()]);
    expect(screen.getByText("45.000 ₺")).toBeInTheDocument();
    expect(screen.getByText("2.500 ₺")).toBeInTheDocument();
  });

  it("hizmet yoksa fiyat bölümünü hiç açmaz", () => {
    renderArea("web", [makeCase()]);
    expect(screen.queryByText("Bu alandaki hizmetler ve fiyatlar")).not.toBeInTheDocument();
  });

  it("galeri görseline tıklayınca büyük görseli açar, Esc kapatır", async () => {
    renderArea("web", [makeCase()]);

    fireEvent.click((await galleryThumbs())[0]);
    const dialog = screen.getByRole("dialog");
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    // Zemine tıklamak kapatmaz; kapatma düğmesi ve Esc kapatır.
    fireEvent.click(dialog);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("büyük görselde sonraki görsele geçer", async () => {
    renderArea("web", [makeCase()]);
    fireEvent.click((await galleryThumbs())[0]);

    fireEvent.click(screen.getByRole("button", { name: "Sonraki görsel" }));
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sonraki görsel" })).toBeDisabled();
  });
});
