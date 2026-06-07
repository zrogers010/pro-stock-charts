import Header from "@/components/Header";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ProStockCharts handles analytics, local browser storage, market data, and third-party services.",
  alternates: {
    canonical: canonicalPath("/privacy"),
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How ProStockCharts handles analytics, local browser storage, market data, and third-party services.",
    url: canonicalPath("/privacy"),
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Privacy
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            ProStockCharts is built for public market research without accounts
            or paywalls. This page explains the limited data the site may use to
            operate and improve the experience.
          </p>
        </div>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Analytics
            </h2>
            <p>
              If analytics are enabled, ProStockCharts may use Google Analytics
              to understand aggregate usage such as page views, chart
              interactions, and popular routes. Analytics are configured with an
              optional environment variable and are not required for the site to
              function.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Browser Storage
            </h2>
            <p>
              Watchlists and recently viewed symbols may be stored locally in
              your browser so the app can remember your preferences on the same
              device. ProStockCharts does not require an account for these
              features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Market Data
            </h2>
            <p>
              Market data, news, company details, and charts are requested from
              third-party providers. See the{" "}
              <Link href="/data-disclaimer" className="text-blue-400 hover:text-blue-300">
                data disclaimer
              </Link>{" "}
              for important source, delay, and use limitations.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

