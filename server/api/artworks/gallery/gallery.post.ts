// To Do:
// 1.) require authentication
// 2.) validate form input
// 3.) call uploadGallery() to upload images

export default defineEventHandler(async (event) => {
  console.log("Received request to upload gallery images!");

  // 1.) Require authentication
  const user = await requireAdmin(event);

  // 2.) Validate form input
  const formData = await readMultipartFormData(event);
});
