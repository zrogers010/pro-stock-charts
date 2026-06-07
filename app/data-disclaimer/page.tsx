import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Disclaimer",
  description:
    "Important information about market data, quote delays, educational use, and investment advice on ProStockCharts.",
  alternates: {
    canonical: "/data-disclaimer",
  },
};

export default function DataDisclaimerPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Data and Use
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Data Disclaimer
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            ProStockCharts is a research and education tool. It is not a broker,
            investment adviser, or trading recommendation service.
          </p>
        </div>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Market Data
            </h2>
            <p>
              Quotes, charts, company details, news, and related market data are
              sourced from third-party providers and may be delayed, incomplete,
              revised, or unavailable. Always verify important prices and market
              information with your broker, exchange, or primary data provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Not Investment Advice
            </h2>
            <p>
              Information on this site is for general research and educational
              purposes only. It is not personalized financial, investment, tax,
              legal, or trading advice. You are responsible for your own
              investment decisions and risk management.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Analyst and News Data
            </h2>
            <p>
              Analyst targets, consensus labels, company profiles, and news
              headlines may come from third-party sources. Treat them as inputs
              for further research, not as instructions to buy, sell, or hold a
              security.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
