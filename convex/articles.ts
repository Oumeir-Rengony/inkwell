import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import slugify from "slugify";
import { prosemirrorSync } from "./prosemirror";
import { components } from "./_generated/api";

/**
 * Get the current user or throw. Used in mutations that require auth.
 */
async function requireUser(ctx: QueryCtx) {
   const identity = await ctx.auth.getUserIdentity();
   if (!identity) throw new Error("Not authenticated");

   const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();

   if (!user) throw new Error("User not found.");
   return user;
}


export const createDraftArticle = mutation({
   handler: async (ctx: MutationCtx) => {
      const user = await requireUser(ctx);

      if (!user) {
         return
      }

      const articleId = await ctx.db.insert("articles", {
         title: "",
         slug: "",
         authorId: user._id,
         content: "",
         status: "draft",
         updatedAt: Date.now(),
      });

      await prosemirrorSync.create(ctx, articleId, { type: "doc", content: [] });


      return articleId;
   },
});

export const remove = mutation({
   args: {
      articleId: v.id("articles"),
   },
   handler: async (ctx: MutationCtx, { articleId }) => {
      const user = await requireUser(ctx);

      if (!user) throw new Error("UnAuthorized");

      const article = await ctx.db.get(articleId);
      if (!article) throw new Error("Article not found");

      // Delete prosemirror snapshots and steps
      await ctx.runMutation(components.prosemirrorSync.lib.deleteDocument, {
         id: articleId,
      });

      await ctx.db.delete(articleId);

   }


});

export const updateContent = mutation({
   args: {
      articleId: v.id("articles"),
      title: v.optional(v.string()),
      slug:  v.optional(v.string()),
      content: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      description: v.optional(v.string()),
      tags: v.optional(v.array(v.string()))
   },
   handler: async (ctx: MutationCtx, args) => {

      const user = await requireUser(ctx);

      if (!user) throw new Error("UnAuthorized");


      await ctx.db.patch(args.articleId, {
         //loose inequality so catches undefined also
         ...(args.title != null &&  { title: args.title, slug: slugify(args.title || "", {lower: true, strict: true}) }),
         ...(args.content != null && { content: args.content }),
         // ...(args.slug != null && { slug: args.slug }),
         ...(args.coverImage != null && { coverImage: args.coverImage }),
         ...(args.description != null && { description: args.description }),
         ...(args.tags != null && { tags: args.tags }),
         updatedAt: Date.now(),
      });
   },
});

export const togglePublish = mutation({
  args: {
   articleId: v.id("articles"),
   content: v.string()
  },
  handler: async (ctx: MutationCtx, { articleId, content}) => {

    const user = await requireUser(ctx);
    const article = await ctx.db.get(articleId);

    if (!article) throw new Error("Article not found");

    if (!user) {
      throw new Error("Unauthorized");
    }

    const isPublished = article?.status === "published";

    //currently draft, user clicked on publish
    if(!isPublished){
      // Delete prosemirror snapshots and steps
      // await ctx.runMutation(components.prosemirrorSync.lib.deleteDocument, {
      //    id: articleId,
      // });

    }

    await ctx.db.patch(articleId, {
      status: isPublished ? "draft" : "published",
      content: isPublished ? "" : content,
      publishedAt: isPublished ? undefined : Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getArticleBySlug = query({
   args: { slug: v.string() },

   handler: async (ctx: QueryCtx, { slug }) => {

      const article = await ctx.db
         .query("articles")
         .withIndex("by_slug", q => q.eq("slug", slug))
         .unique();

      if (!article || article.status !== "published") return null;

      return article;
   },
});

export const getArticleById = query({
   args: { id: v.id("articles") },

   handler: async (ctx: QueryCtx, { id }) => {

      const article = await ctx.db.get(id);

      if (!article) return null;

      return article;
   },
});

export const getAllArticles = query({
   handler: async (ctx) => {
      return await ctx.db.query("articles").collect();
   },
});