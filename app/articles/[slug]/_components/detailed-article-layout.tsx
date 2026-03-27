"use client"

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function formatDate(iso: string | number) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DetailedArticleLayout({
  slug
}: {
  slug: string
}) {
  
  const article = useQuery(api.articles.getArticleBySlug, {
    slug: slug || ""
  })

  if (!article) {
    return <p>...loading</p>
  }

  return (
    <main>

      {/* Back */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 mb-10 text-[#9AABA3] text-sm no-underline"
      >
        <ArrowLeft size={14} />
        All articles
      </Link>

      {/* Tags */}
      {article.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {article?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-bold uppercase tracking-[0.08em] text-[#4A7A56] bg-[#E8EDE9] py-1 px-2.5 rounded-fulll"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-5 font-playfair text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-[-0.015em] text-[#0A1714]">
        {article.title}
      </h1>

      {/* Byline */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E8EDE9]">
        <span className="text-sm text-[#5C706A]">
          {formatDate(article?.updatedAt)}
        </span>
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <div className="rounded-xl overflow-clip mb-12 h-100 bg-[#E8EDE9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="article-body prose prose-sm sm:prose-base lg:prose-lg m-5 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: article?.content }}
      />

      {/* <RelatedArticles related={related} /> */}
    </main>
  )
}

const RelatedArticles = ({ related }: { related: any[] }) => {
  return (
    <>
      <section
        style={{
          borderTop: "1px solid #E8EDE9",
          backgroundColor: "#FDFAF4",
          padding: "4rem 1.25rem 5rem",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.5rem" }}>
              <div style={{ width: 24, height: 1, backgroundColor: "#4A7A56" }} />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#4A7A56",
                }}
              >
                Continue Reading
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#0A1714",
                lineHeight: 1.2,
              }}
            >
              Related Articles
            </h2>
          </div>

          {/* Cards grid */}
          <div className="related-grid">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/articles/${rel.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <article
                  className="related-card"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8EDE9",
                    borderRadius: 14,
                    overflow: "hidden",
                    height: "100%",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  {/* Cover */}
                  {rel.coverImage ? (
                    <div style={{ height: 160, backgroundColor: "#E8EDE9", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                        className="related-card-img"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 8,
                        backgroundColor: "#E8EDE9",
                        background: "linear-gradient(90deg, #C8D6CB, #E8EDE9)",
                      }}
                    />
                  )}

                  <div style={{ padding: "1.5rem" }}>
                    {/* Tags */}
                    {rel.tags && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.75rem" }}>
                        {rel.tags
                          .split(",")
                          .slice(0, 2)
                          .map((t: string) => t.trim())
                          .filter(Boolean)
                          .map((tag: string) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#4A7A56",
                                backgroundColor: "#E8EDE9",
                                padding: "0.15rem 0.5rem",
                                borderRadius: 9999,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "#0A1714",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {rel.title || "Untitled"}
                    </h3>

                    {/* Excerpt */}
                    {rel.excerpt && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.65,
                          color: "#5C706A",
                          marginBottom: "1rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {rel.excerpt}
                      </p>
                    )}

                    {/* Date + read more */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ fontSize: "0.78rem", color: "#9AABA3" }}>
                        {formatDate(rel.updatedAt)}
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#4A7A56" }}>
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .related-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }

          .related-card:hover {
            border-color: #C8D6CB;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
          }

          .related-card:hover .related-card-img {
            transform: scale(1.04);
          }

          @media (max-width: 768px) {
            .related-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
          }

          @media (min-width: 480px) and (max-width: 768px) {
            .related-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </section>
    </>
  )
}