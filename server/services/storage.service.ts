import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";

// To Do - use validateImage instead of validating here
// To Do - retrieve relative file path - not full public URL
// first check - what does path return?
async function uploadFile(
  supabase: SupabaseClient<Database>,
  file: File,
  bucket: string,
) {
  console.log("uploading file!");
  // RLS error here

  if (!supabase || !file || !bucket) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing parameters",
    });
  }

  const ext = (file.name && file.name.split(".").pop()) || "png";
  const fileName = file.name;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw error;
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: data?.path ?? fileName,
    publicUrl: publicData?.publicUrl ?? null,
  };
}

async function deleteFile(
  supabase: SupabaseClient<Database>,
  filePath: string,
  bucket: string,
) {
  if (!supabase || !filePath || !bucket) {
    throw new Error("Missing parameters for deleteFile");
  }

  // const { data, error: listError } = await supabase.storage.listBuckets();
  // console.log("listing public buckets: " + data);

  console.log("deleting file:", filePath + " from bucket:", bucket);
  const { error, data: deleted } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  if (error) {
    console.error("Supabase storage delete error:", error);
    throw error;
  }
  console.log("file deleted successfully: " + deleted); // no data returned on delete
}

export { uploadFile, deleteFile };
