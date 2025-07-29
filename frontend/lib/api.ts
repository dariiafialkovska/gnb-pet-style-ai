const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateImageWithOpenAI(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.image_url) return data.image_url;

  throw new Error(data.error || "Failed to generate image");
}
