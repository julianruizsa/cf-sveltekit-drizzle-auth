import type { Actions, PageServerLoad } from "./$types";
import { guestbookMessages } from "$lib/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const messages = await locals.db
    .select()
    .from(guestbookMessages)
    .where(eq(guestbookMessages.userId, locals.user.id))
    .limit(10)
    .orderBy(desc(guestbookMessages.createdAt));

  return {
    messages,
    user: locals.user,
  };
};

export const actions: Actions = {
  // default: async ({ request, platform, locals }) => {
  //   const formData = await request.formData();
  //   const message = formData.get("message");
  //   const country = platform?.cf?.country ?? "Unknown";

  //   await locals.db.insert(guestbookMessages).values({
  //     message: (message as string),
  //     country: country as string,
  //     userId: locals.user.id,
  //   });

  //   return {
  //     success: true,
  //   };
  // },
  createMessageWithAction: async ({ request, platform, locals }) => {
    const formData = await request.formData();
    const message = formData.get("message");
    const country = platform?.cf?.country ?? "Unknown";

    if (!message) {
      //Whatever returned will be available in the form prop in the page
      return fail(400, {
        errors: {
          message: "Message is required",
        },
      });
    }

    await locals.db.insert(guestbookMessages).values({
      message: (message as string) + " (created with createMessage action)",
      country: country as string,
      userId: locals.user.id,
    });

    //Whatever returned will be available in the form prop in the page
    return {
      success: true,
    };
  },

  createMessageWithFunction: async ({ request, platform, locals }) => {
    const formData = await request.formData();
    const message = formData.get("message");
    const country = platform?.cf?.country ?? "Unknown";

    if (!message) {
      //Whatever returned will be available in the form prop in the page
      return fail(400, {
        errors: {
          message: "Message is required",
        },
      });
    }

    await locals.db.insert(guestbookMessages).values({
      message: (message as string) + " (created with createMessage function)",
      country: country as string,
      userId: locals.user.id,
    });

    return {
      success: true,
    };
  },
};
