import type { H3Event } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";

export async function requireAdmin(
  event: H3Event
  // supabase: SupabaseClient<Database>
) {
  // fixed - this was failing whenever the token was expired
  const user = await serverSupabaseUser(event); // apparently this should refresh the session
  if (!user) {
    console.log("user not found in server!");
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        message: "User not authenticated",
      },
    });
    // return sendRedirect(event, "/admin/login");
  }
  // const supabase = await serverSupabaseClient(event);

  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (error || !user) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "Unauthorized",
  //     data: {
  //       message: "User not authenticated",
  //     },
  //   });
  // }

  // To Do: check admin email
  const config = useRuntimeConfig();
  if (user.email !== config.public.admin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      data: { message: "User is not admin" },
    });
  }

  return user;
}
