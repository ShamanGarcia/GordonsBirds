import { EB_Garamond } from "next/font/google";

// EB Garamond — an open-source (SIL OFL) revival of Claude Garamont's
// 16th-century types; the standard freely-licensed substitute for
// "Garamond" (the original digitizations are commercially licensed).
export const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
  fallback: ["Garamond", "Georgia", "serif"],
});
