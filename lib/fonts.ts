import localFont from "next/font/local";

// W95FA by MadeByArne — a modern re-creation of the Windows 95 system font.
// Free for commercial use, SIL Open Font License (see assets/fonts/W95FA-OFL.txt).
export const w95fa = localFont({
  src: [
    { path: "../assets/fonts/w95f.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/w95f.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-w95fa",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});
