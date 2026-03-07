import { z } from "zod";
import type { MultiPartData } from "h3";
import { validateImageFile } from "./image";
import type { ArtworkData } from "#types/artworks/artworks";
import type { UploadInput } from "~~/server/services/storage.service";

// To Do: organize a little better
// Refactor validation logic
const isoDateString = z
  .string()
  .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Invalid date",
  });

export const articleFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    author: z.string().min(1, { message: "Author is required" }),
  })
  .strict()
  .strip();

export type ArticleForm = z.infer<typeof articleFormSchema>;

export const validateArticleForm = (form: ArticleForm) => {
  return articleFormSchema.safeParse(form);
};

const FileType = typeof File !== "undefined" ? File : Object;

const priceSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Invalid price")
  .transform((val) => Number(val));

export const artworkFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: priceSchema,
    dimensions: z.string().min(1, { message: "Dimensions are required" }),
    artwork_note: z.string().optional(),
    collection: z.string().min(1, { message: "Collection is required" }),
    cover_image: z.boolean().optional(),
  })
  .strict()
  .strip();

export const existingArtworkFormSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: priceSchema,
    dimensions: z.string().min(1, { message: "Dimensions are required" }),
    image: z.custom<File>((v) => v instanceof FileType).optional(),
  })
  .strict()
  .strip();

export const gallerySchema = z.object({
  artworkId: z.string().uuid(),
  images: z
    .array(
      z.object({
        filename: z.string().min(1),
        data: z.instanceof(Buffer),
      }),
    )
    .min(1, "At least one image is required"),
});

export type GalleryForm = z.infer<typeof gallerySchema>;

export type ArtworkForm = z.infer<typeof artworkFormSchema>;

export type ExistingArtworkForm = z.infer<typeof existingArtworkFormSchema>;

export const validateNewArtworkForm = async (form: ArtworkData) => {
  if (!form) {
    console.log("No form data received!");
    return { success: false, message: "No form data received" };
  }

  console.log(JSON.stringify(form));

  const parsed = artworkFormSchema.safeParse(form);

  return parsed;
};

export const validateExistingArtworkForm = async (form: MultiPartData[]) => {
  console.log("safe parsing artwork form...");

  // Extract fields from multipart array into object
  const id = form.find((field) => field.name === "id")?.data?.toString() || "";
  const title =
    form.find((field) => field.name === "title")?.data?.toString() || "";
  const description =
    form.find((field) => field.name === "description")?.data?.toString() || "";
  const price =
    form.find((field) => field.name === "price")?.data?.toString() || "";
  const imageField = form.find((field) => field.name === "image");
  const dimensions =
    form.find((field) => field.name === "dimensions")?.data?.toString() || "";

  // Convert to File object
  let image: File | undefined = undefined;
  if (imageField && imageField.data) {
    image = imageField
      ? new File(
          [new Uint8Array(imageField.data)],
          imageField.filename || "image",
          { type: imageField.type },
        )
      : new File([], "");
  }

  const formData = {
    id,
    title,
    description,
    price,
    dimensions,
    image,
  };
  const parsed = existingArtworkFormSchema.safeParse(formData);

  if (!parsed.success) {
    console.log("Artwork form validation failed:", parsed.error);
    return parsed;
  }

  // try {
  //   validateImageFile(parsed.data.image);
  // } catch (error) {
  //   console.log("Image validation failed:", error);
  //   const zodError = new z.ZodError([
  //     {
  //       code: z.ZodIssueCode.custom,
  //       path: ["image"],
  //       message:
  //         error instanceof Error ? error.message : "Failed to validate image!",
  //     },
  //   ]);
  //   return {
  //     success: false as const,
  //     error: zodError,
  //   };
  // }

  return parsed;
};

// To Do: remove this - all we need is image validation
export const validateGalleryImages = async (
  artworkId: string,
  images: UploadInput[],
) => {
  // To Do: implement gallery image validation
  // should have artwork ID and image files - safe parse with galleryImageShema
  // for each image file, run validateImageFile()
  if (!artworkId || !images || images.length === 0) {
    throw new Error("No form data provided");
  }

  // const artworkId = form
  //   .find((field) => field.name === "artworkId")
  //   ?.data?.toString();
  // const images = form.filter((field) => field.name === "images");

  // const parsed = gallerySchema.safeParse({
  //   artworkId: artworkId || "",
  //   images: images,
  // });

  // if (!parsed.success) {
  //   throw new Error("Gallery form validation failed");
  // }

  // const validatedImages = [];

  // for (const imageField of images) {
  //   const buffer = imageField.data;
  //   const name = imageField.filename || "image";
  //   const image = new File( // file object
  //     [new Uint8Array(imageField.data)],
  //     imageField.filename || "image",
  //     { type: imageField.type },
  //   );
  //   try {
  //     validateImageFile(image);
  //     validatedImages.push({
  //       filename: name,
  //       data: buffer,
  //       size: buffer.length,
  //       contentType: imageField.type,
  //     });
  //   } catch (error) {
  //     console.log("Gallery image validation failed:", error);
  //     throw error;
  //   }
  // }

  // return { artworkId: parsed.data.artworkId, images: validatedImages };
};
