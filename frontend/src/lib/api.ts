const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateImageWithOpenAI(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  console.log("📡 API call to /generate...");

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    body: formData,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    const text = await res.text();
    console.error("❌ Non-JSON response from backend:", text);
    throw new Error("Server error (non-JSON)");
  }

  if (!res.ok) {
    throw new Error(data.error || "Server error");
  }

  console.log("📩 Response from /generate:", data);

  if (data.image_url) return data.image_url;
  throw new Error("Failed to generate image");
}
