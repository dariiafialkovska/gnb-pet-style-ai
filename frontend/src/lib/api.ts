const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateImageWithOpenAI(
  file: File,
  scenario: string,
  clothing: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scenario", scenario);
  formData.append("clothing", clothing);

  console.log("📡 API call to /generate with:", { scenario, clothing });

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    body: formData,
  });

  const raw = await res.text();

  if (!res.ok) {
    console.error("❌ Backend error response:", raw);
    throw new Error("Server error");
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Invalid JSON from backend:", raw);
    throw new Error("Server returned invalid JSON");
  }

  console.log("📩 Response from /generate:", data);


  if (data.image_url) return data.image_url;
  throw new Error(data.error || "Failed to generate image");
}
