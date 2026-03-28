"use client"

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


function formatDate(iso: string | number) {
   return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
   });
}

export default function ArticlesFeed() {
   const articles = useQuery(api.articles.getPublishedArticles);

   if (!articles) {
      return (
         <p>loading...</p>
      )
   }

   return (
      <div>
         {/* Header */}
         <div className="mb-6 md:mb-14 pb-8 border-b border-[#E8EDE9]">
            <p className="mb-3 font-bold uppercase text-[#4A7A56] tracking-[0.12em] text-[12px]">
               Published articles
            </p>
            <h1 className="font-playfair font-bold text-4xl md:text-5xl text-[#0A1714]">
               The Inkwell
            </h1>
         </div>

         {articles.length === 0 ? (
            <div className="text-center py-20 px-8" >
               <BookOpen size={40} className="text-[#C8D6CB] mb-6 mx-auto" />
               <h3 className="font-playfair text-2xl font-semibold mb-2 text-[#0A1714]">
                  Nothing here yet
               </h3>
               <p className="text-[#9AABA3] text-[16px]">
                  Published articles will appear here.
               </p>
            </div>
         ) : (
            <div className="flex flex-col">
               {articles.map((article, i) => (
                  <article
                     //  className="py-10 px-4 hover:bg-[#faf5e8]"
                     className="py-10 px-4"
                     key={article._id}
                     style={{
                        borderBottom: i < articles.length - 1 ? "1px solid #E8EDE9" : "none",
                     }}
                  >
                     {article.coverImage && (
                        <div className="mb-6 rounded-xl overflow-clip h-70 bg-[#E8EDE9]">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img
                              src={article?.coverImage}
                              alt={article?.title}
                              className="w-full h-full object-cover"
                           />
                        </div>
                     )}

                     {/* Tags */}
                     {article?.tags && (
                        <div className="mb-3 flex flex-wrap gap-2">
                           {article?.tags?.map((tag) => (
                              <span key={tag} className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#4A7A56] bg-[#E8EDE9] py-1 px-2.5 rounded-full">
                                 {tag}
                              </span>
                           ))}
                        </div>
                     )}

                     {/* <Link
                        href={`/articles/${article.slug}`}
                        className="no-underline"
                     > */}
                     <h2 className="font-playfair font-bold text-[#0A1714] text-[24px] md:text-[32px] mb-3 leading-tight"
                        style={{ transition: "color 0.15s" }}
                     >
                        {article.title || "Untitled"}
                     </h2>
                     {/* </Link> */}

                     {article?.description && (
                        <p className="text-[16px] leading-[1.7] text-[#3A524B] mb-4 max-w-[60%]">
                           {article?.description}
                        </p>
                     )}

                     <div className="flex items-center gap-4">
                        <span className="text-sm text-[#9AABA3]">
                           {formatDate(article?.updatedAt)}
                        </span>
                        <Link
                           href={`/articles/${article.slug}`}
                           className="text-sm font-semibold text-[#4A7A56] no-underline"
                        >
                           Read more →
                        </Link>
                     </div>
                  </article>
               ))}
            </div>
         )}
      </div>
   );

}
