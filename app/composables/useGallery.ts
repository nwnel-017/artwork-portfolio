export function useGallery() {
  const deleteImage = async (id: string) => {
    if (!id) {
      alert("Missing ID");
    }

    const response = await fetch(`/api/artworks/gallery/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, message: "Something went wrong" };
    }

    return { success: true, message: "Successfully removed image" };
  };

  return { deleteImage };
}
