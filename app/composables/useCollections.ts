import type { Database } from "#types/supabase/database";
import type { CollectionCard } from "#types/collections/collection";

type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];

export function useCollections() {
  const getCollections = () => {
    return useFetch<CollectionCard[]>("/api/collections/collections");
  };

  const deleteCollection = (id: string) => {
    if (!id) return;
    return $fetch(`/api/collections/${id}`, {
      method: "DELETE",
    });
  };

  return { getCollections, deleteCollection };
}
