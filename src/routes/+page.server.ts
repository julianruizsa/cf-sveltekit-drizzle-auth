import type { Actions, PageServerLoad } from "./$types";
import { guestbookMessages, user } from "$lib/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
  const messages = await locals.db
    .select()
    .from(guestbookMessages)
    .innerJoin(user, eq(user.id, guestbookMessages.userId))
    .limit(10)
    .orderBy(desc(guestbookMessages.createdAt));

  return {
    messages,
  };
};

export const actions: Actions = {
  default: async ({ request, platform, locals }) => {
    const formData = await request.formData();
    const message = formData.get("message");
    const country = platform?.cf?.country ?? "Unknown";

    const session = await locals.auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user.id) throw new Error("Not authenticated");

    await locals.db.insert(guestbookMessages).values({
      message: message as string,
      country: country as string,
      userId: session?.user.id,
    });

    return {
      success: true,
    };
  },
};
