import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";

export default async function CallbackPage() {

   const { userId } = await auth();

   if (!userId) {
      redirect("/sign-in");
   }

   const user = await currentUser();

   if (!user) {
      redirect("/sign-in");
   }

   const convexUserId = await fetchMutation(api.users.upsertUser, {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
      avatarUrl: user.imageUrl || undefined,
   });

   console.log(convexUserId)


   redirect("/dashboard");
}