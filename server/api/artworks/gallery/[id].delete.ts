export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = event.context.params?.id as string;

  console.log("reached DELETE api call for gallery");
});
