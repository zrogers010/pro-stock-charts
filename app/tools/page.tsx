import Header from "@/components/Header";
import { siteUrl } from "@/lib/markets";
import { canonicalPath } from "@/lib/seo";
import { researchTools } from "@/lib/tools";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Research Tools",
  description:
    "Free market research tools for chart planning, risk sizing, and trading education.",
  alternates: {
    canonical: canonicalPath("/tools"),
  },
  openGraph: {
    title: "Market Research Tools",
    description:
      "Free market research tools for chart planning, risk sizing, and trading education.",
    url: canonicalPath("/tools"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Research Tools",
    description:
      "Free market research tools for chart planning, risk sizing, and trading education.",
  },
};

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Market Research Tools",
    description:
      "Free market research tools for chart planning, risk sizing, and trading education.",
    url: `${siteUrl}/tools`,
    publisher: {
      "@type": "Organization",
      name: "ProStockCharts",
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-blue-400 transition-colors hover:text-blue-300"
        >
          Back to charts
        </Link>
        <div className="mb-10 mt-6 max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Tools
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Market Research Tools
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Free calculators and planning tools for market research workflows.
            These tools are educational and do not provide investment advice.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {researchTools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700/60 hover:bg-zinc-800/50"
            >
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
                {tool.category}
              </div>
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-white">
                {tool.title}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-500">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
