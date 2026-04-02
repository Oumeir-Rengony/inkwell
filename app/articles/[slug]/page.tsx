import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Layout from "@/components/ui/app-shell";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type PageProps = { params: Promise<{ slug: string }> };

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const article = db.articles.findBySlug(slug);
//   if (!article || article?.status !== "published") {
//     return { title: "Article not found — Inkwell" };
//   }
//   return {
//     title: `${article?.title} — Inkwell`,
//     description: article?.excerpt || `Read "${article?.title}" on Inkwell`,
//     openGraph: {
//       title: article?.title,
//       description: article?.excerpt,
//       images: article?.coverImage ? [article?.coverImage] : [],
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

   if (!slug) {
      notFound();
   }

   const article = await fetchQuery(api.articles.getArticleBySlug, {
      slug: slug || ""
   })

   return (
      <Layout className="max-w-180 py-0">
         {/* <DetailedArticleLayout slug={slug} /> */}
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
            {article?.tags && (
               <div className="flex flex-wrap gap-2 mb-6">
                  {article?.tags?.map((tag: string) => (
                     <span
                        key={tag}
                        className="text-xs font-bold uppercase tracking-[0.08em] text-[#4A7A56] bg-[#E8EDE9] py-1 px-2.5 rounded-full"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            )}

            {/* Title */}
            <h1 className="mb-5 font-playfair text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-[-0.015em] text-[#0A1714]">
               {article?.title}
            </h1>

            {/* Byline */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E8EDE9]">
               <span className="text-sm text-[#5C706A]">
                  {formatDate(article?.updatedAt || "")}
               </span>
            </div>

            {/* Cover image */}
            {article?.coverImage && (
               <div className="rounded-xl overflow-clip mb-12 h-100 bg-[#E8EDE9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                     src={article?.coverImage}
                     alt={article?.title}
                     className="w-full h-full object-cover"
                  />
               </div>
            )}

            {/* Article body */}
            <div
               className="article-body prose prose-sm sm:prose-base lg:prose-lg m-5 focus:outline-none"
               dangerouslySetInnerHTML={{ __html: article?.content || "" }}
            />

            {/* <RelatedArticles related={related} /> */}
         </main>
      </Layout>
   )
}