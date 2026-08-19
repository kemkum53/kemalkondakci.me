import { permanentRedirect } from "next/navigation";

// /hire eski adres; hizmet ve fiyat sayfası /services altında.
export default function HirePage() {
  permanentRedirect("/services");
}
