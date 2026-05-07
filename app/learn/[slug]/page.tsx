import Header from "@/components/Header";
import { educationArticles, getEducationArticle } from "@/lib/education";
import { siteUrl } from "@/lib/markets";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return educationArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getEducationArticle(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/learn/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/learn/${article.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default function LearnArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getEducationArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/learn/${article.slug}`,
    author: {
      "@type": "Organization",
      name: "ProStockCharts",
      url: siteUrl,
    },
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to charts
        </Link>
        <div className="mt-6 mb-10">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            {article.readTime}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            {article.description}
          </p>
        </div>

        <div className="space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
                {section.heading}
              </h2>
              <p className="text-zinc-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
