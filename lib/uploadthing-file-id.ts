export default function getIdFromUrl(url: string) {
  try {
    const fileName = url.split("/").pop();
    return fileName;
  } catch (error) {
    console.error("Error extracting ID from URL:", error);
    return "";
  }
}
