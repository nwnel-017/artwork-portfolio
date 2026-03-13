import type { Database } from "./database";

export type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"];

export type CoverImageRow = Database["public"]["Tables"]["cover_images"]["Row"];

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
