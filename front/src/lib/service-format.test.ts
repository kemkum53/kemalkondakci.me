import { describe, it, expect } from "vitest";
import { formatDelivery, formatPrice, quoteLabel } from "./service-format";

const base = {
  priceType: "fixed",
  setupPriceMin: null as number | null,
  setupPriceMax: null as number | null,
  monthlyPrice: null as number | null,
  currency: "TRY",
};

describe("formatPrice", () => {
  it("teklife göre seçilince rakam göstermez", () => {
    const p = formatPrice({ ...base, priceType: "quote", setupPriceMin: 45000 }, "tr");
    expect(p.isQuote).toBe(true);
    expect(p.setupValue).toBeNull();
    expect(p.monthlyValue).toBeNull();
  });

  it("hiç rakam girilmemişse teklife göre davranır", () => {
    expect(formatPrice(base, "tr").isQuote).toBe(true);
  });

  it("Türkçede sembolü sona koyar", () => {
    const p = formatPrice({ ...base, setupPriceMin: 45000 }, "tr");
    expect(p.isQuote).toBe(false);
    expect(p.setupLabel).toBe("Kurulum");
    expect(p.setupValue).toBe("45.000 ₺");
  });

  it("İngilizcede sembolü başa koyar", () => {
    const p = formatPrice({ ...base, setupPriceMin: 45000, currency: "USD" }, "en");
    expect(p.setupValue).toBe("$45,000");
  });

  it("bilinmeyen para biriminde kodu sembol yerine kullanır", () => {
    const p = formatPrice({ ...base, setupPriceMin: 1000, currency: "GBP" }, "tr");
    expect(p.setupValue).toBe("1.000 GBP");
  });

  it("Türkçe aralıkta sembolü bir kez, sonda yazar", () => {
    const p = formatPrice(
      { ...base, priceType: "range", setupPriceMin: 45000, setupPriceMax: 90000 },
      "tr"
    );
    expect(p.setupValue).toBe("45.000 - 90.000 ₺");
  });

  it("İngilizce aralıkta sembolü iki tarafa da yazar", () => {
    const p = formatPrice(
      { ...base, priceType: "range", setupPriceMin: 45000, setupPriceMax: 90000, currency: "USD" },
      "en"
    );
    expect(p.setupValue).toBe("$45,000 - $90,000");
  });

  it("aralıkta üst sınır alt sınıra eşitse tek değer yazar", () => {
    const p = formatPrice(
      { ...base, priceType: "range", setupPriceMin: 45000, setupPriceMax: 45000 },
      "tr"
    );
    expect(p.setupValue).not.toContain(" - ");
  });

  it("başlangıç fiyatı etiketini kullanır", () => {
    const tr = formatPrice({ ...base, priceType: "from", setupPriceMin: 15000 }, "tr");
    expect(tr.setupLabel).toBe("Başlangıç");
    const en = formatPrice({ ...base, priceType: "from", setupPriceMin: 15000 }, "en");
    expect(en.setupLabel).toBe("Starting at");
  });

  it("aylık bedeli kurulumdan ayrı satır olarak döner", () => {
    const p = formatPrice({ ...base, setupPriceMin: 45000, monthlyPrice: 2500 }, "tr");
    expect(p.monthlyLabel).toBe("Aylık");
    expect(p.monthlyValue).toContain("2.500");
  });

  it("aylık bedel 0 ise gösterilmez", () => {
    const p = formatPrice({ ...base, setupPriceMin: 45000, monthlyPrice: 0 }, "tr");
    expect(p.monthlyValue).toBeNull();
  });

  it("sadece aylık bedel varsa abonelik gibi görünür", () => {
    const p = formatPrice({ ...base, monthlyPrice: 1500 }, "tr");
    expect(p.isQuote).toBe(false);
    expect(p.setupValue).toBeNull();
    expect(p.monthlyValue).toContain("1.500");
  });

  it("teklife göre etiketi dile göre değişir", () => {
    expect(quoteLabel("tr")).toBe("Teklife göre");
    expect(quoteLabel("en")).toBe("Custom quote");
  });
});

const delivery = {
  deliveryMinDays: null as number | null,
  deliveryMaxDays: null as number | null,
  deliveryNoteTr: "",
  deliveryNoteEn: "",
};

describe("formatDelivery", () => {
  it("süre girilmemişse null döner", () => {
    expect(formatDelivery(delivery, "tr")).toBeNull();
  });

  it("aralığı yazar", () => {
    expect(
      formatDelivery({ ...delivery, deliveryMinDays: 21, deliveryMaxDays: 35 }, "tr")
    ).toBe("21 - 35 gün");
  });

  it("alt ve üst eşitse tek değer yazar", () => {
    expect(
      formatDelivery({ ...delivery, deliveryMinDays: 14, deliveryMaxDays: 14 }, "tr")
    ).toBe("14 gün");
  });

  it("sadece alt sınır varsa en az olarak yazar", () => {
    expect(formatDelivery({ ...delivery, deliveryMinDays: 10 }, "tr")).toBe("10 gün+");
    expect(formatDelivery({ ...delivery, deliveryMinDays: 10 }, "en")).toBe("10+ days");
  });

  it("sadece üst sınır varsa üst sınır olarak yazar", () => {
    expect(formatDelivery({ ...delivery, deliveryMaxDays: 7 }, "tr")).toBe("7 güne kadar");
    expect(formatDelivery({ ...delivery, deliveryMaxDays: 7 }, "en")).toBe("up to 7 days");
  });

  it("notu parantez içinde ekler", () => {
    expect(
      formatDelivery(
        { ...delivery, deliveryMinDays: 21, deliveryMaxDays: 35, deliveryNoteTr: "içerik hazırsa" },
        "tr"
      )
    ).toBe("21 - 35 gün (içerik hazırsa)");
  });

  it("süre yoksa tek başına notu döner", () => {
    expect(formatDelivery({ ...delivery, deliveryNoteTr: "kapsama göre" }, "tr")).toBe(
      "kapsama göre"
    );
  });

  it("dile göre doğru notu seçer", () => {
    const input = { ...delivery, deliveryNoteTr: "TR not", deliveryNoteEn: "EN note" };
    expect(formatDelivery(input, "tr")).toBe("TR not");
    expect(formatDelivery(input, "en")).toBe("EN note");
  });
});
