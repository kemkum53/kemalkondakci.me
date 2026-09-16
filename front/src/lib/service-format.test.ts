import { describe, it, expect } from "vitest";
import { formatDelivery } from "./service-format";

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
