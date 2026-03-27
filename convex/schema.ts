import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

   users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

   articles: defineTable({
      title: v.string(),
      slug: v.string(),

      authorId: v.id("users"),

      status: v.union(
         v.literal("draft"),
         v.literal("published")
      ),

      content: v.string(),
      tags: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      coverImage: v.optional(v.string()),

      updatedAt: v.number(),
      publishedAt: v.optional(v.number()),

   })
      .index("by_slug", ["slug"])
      .index("by_author", ["authorId"])
      .index("by_status", ["status"])
      .index("by_publishedAt", ["publishedAt"])
      .index("by_status_publishedAt", ["status", "publishedAt"])
      .searchIndex("search_articles", {
         searchField: "title",
         filterFields: ["status", "authorId"],
      }),
});