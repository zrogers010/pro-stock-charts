import Header from "@/components/Header";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using ProStockCharts market charts, research pages, data exports, and educational content.",
  alternates: {
    canonical: canonicalPath("/terms"),
  },
  openGraph: {
    title: "Terms of Use",
    description:
      "Terms for using ProStockCharts market charts, research pages, data exports, and educational content.",
    url: canonicalPath("/terms"),
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Terms
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Terms of Use
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            By using ProStockCharts, you agree to use the site as a research and
            education tool and to verify important market information before
            making decisions.
          </p>
        </div>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Research and Education Only
            </h2>
            <p>
              ProStockCharts does not provide personalized financial,
              investment, tax, legal, or trading advice. You are responsible for
              your own investment decisions and risk management.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Data Limitations
            </h2>
            <p>
              Quotes, charts, news, company details, analyst fields, and related
              market data may be delayed, incomplete, revised, or unavailable.
              Review the{" "}
              <Link href="/data-disclaimer" className="text-blue-400 hover:text-blue-300">
                data disclaimer
              </Link>{" "}
              before relying on any market information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              No Trading Relationship
            </h2>
            <p>
              ProStockCharts is not a broker, exchange, investment adviser, or
              trading execution service. The site does not accept orders,
              custody funds, or recommend specific transactions.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

