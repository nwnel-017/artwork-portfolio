import { file, z } from "zod";
import type { MultiPartData, createError } from "h3";
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
    // image: z.custom<File>((v) => v instanceof FileType),
    // image: z.object({
    //   filename: z.string().min(1),
    //   data: z.instanceof(Buffer),
    // }),
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
    // publishDate: isoDateString,
    image: z.custom<File>((v) => v instanceof FileType),
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
  console.log("safe parsing artwork form...");

  // Extract fields from multipart array into object - not necessary - already done in api endpoint
  // const title =
  //   form.find((field) => field.name === "title")?.data?.toString() || "";
  // const description =
  //   form.find((field) => field.name === "description")?.data?.toString() || "";
  // // const artist =
  // //   form.find((field) => field.name === "artist")?.data?.toString() || "";
  // const price =
  //   form.find((field) => field.name === "price")?.data?.toString() || "";
  // const dimensions =
  //   form.find((field) => field.name === "dimensions")?.data?.toString() || "";
  // const imageField = form.find((field) => field.name === "image");
  // const publishDate =
  //   form.find((field) => field.name === "publishDate")?.data?.toString() || "";

  // Convert to File object
  // image is a File object?
  // use this file object to validate the image
  // remove this later - using File object is not reliable

  if (!form) {
    console.log("No form data received!");
    return { success: false, message: "No form data received" };
  }

  // wrong - call image validator from api endpoint
  // const imageFile = imageField
  //   ? new File(
  //       [new Uint8Array(imageField.data)],
  //       imageField.filename || "image",
  //       { type: imageField.type },
  //     )
  //   : new File([], "");

  // try {
  //   validateImageFile(imageFile);
  // } catch (error) {
  //   console.log("Image validation failed:", error);
  //   // const zodError = new z.ZodError([
  //   //   {
  //   //     code: z.ZodIssueCode.custom,
  //   //     path: ["image"],
  //   //     message:
  //   //       error instanceof Error ? error.message : "Failed to validate image!",
  //   //   },
  //   // ]);
  //   // // To Do: handle this error properly and consistently with other errors
  //   // return {
  //   //   success: false as const,
  //   //   error: zodError,
  //   // };
  //   throw new Error("Validation failed");
  // }

  // console.log("Image validation passed");

  // const buffer = imageField?.data;
  // const name = imageField?.filename || "image";

  // if (!buffer || !name) {
  //   // const zodError = new z.ZodError([
  //   //   {
  //   //     code: z.ZodIssueCode.custom,
  //   //     path: ["image"],
  //   //     message: "Image is required",
  //   //   },
  //   // ]);
  //   // return {
  //   //   success: false as const,
  //   //   error: zodError,
  //   // };
  //   console.log("Missing image data!");
  //   throw new Error("Validation failed");
  // }

  // const image = {
  //   filename: name,
  //   buffer: buffer,
  //   size: buffer.length,
  //   contentType: imageField.type,
  // };

  // // console.log("Validated image:", validatedImage); // validatedImage is correct

  // // const formData = { title, description, artist, price, dimensions, image };
  // const formData = {
  //   title,
  //   description,
  //   price,
  //   dimensions,
  //   image, // "Invalid input: expected object, received undefined"
  // };

  // const parsed = artworkFormSchema.safeParse(formData); // heres where were failing

  const parsed = artworkFormSchema.safeParse(form);

  // if (!parsed.success) {
  //   console.log("Artwork form validation failed:", parsed.error);
  //   throw new Error("Artwork form validation failed");
  // }

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
  // const publishDate =
  //   form.find((field) => field.name === "publishDate")?.data?.toString() || "";

  // Convert to File object
  const image = imageField
    ? new File(
        [new Uint8Array(imageField.data)],
        imageField.filename || "image",
        { type: imageField.type },
      )
    : new File([], "");

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

  try {
    validateImageFile(parsed.data.image);
  } catch (error) {
    console.log("Image validation failed:", error);
    const zodError = new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ["image"],
        message:
          error instanceof Error ? error.message : "Failed to validate image!",
      },
    ]);
    return {
      success: false as const,
      error: zodError,
    };
  }

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
