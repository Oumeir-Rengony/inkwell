import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Layout from "@/components/ui/layout";
import DetailedArticleLayout from "./_components/detailed-article-layout";

type PageProps = { params: Promise<{ slug: string }> };

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const article = db.articles.findBySlug(slug);
//   if (!article || article.status !== "published") {
//     return { title: "Article not found — Inkwell" };
//   }
//   return {
//     title: `${article.title} — Inkwell`,
//     description: article.excerpt || `Read "${article.title}" on Inkwell`,
//     openGraph: {
//       title: article.title,
//       description: article.excerpt,
//       images: article.coverImage ? [article.coverImage] : [],
//       type: "article",
//     },
//   };
// }


function formatDate(iso: string | number) {
   return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
   });
}



export default async function ArticlePage({ params }: PageProps) {
   const { slug } = await params;

   return (
      <Layout className="max-w-180 py-0">
         <DetailedArticleLayout slug={slug} />
      </Layout>
   )
}