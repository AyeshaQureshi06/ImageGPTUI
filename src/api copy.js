export const API_BASE = "http://127.0.0.1:5000";

export async function generateStoryFromImage(imageFile, mood, inputText) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("mood", mood);
  formData.append("input_text", inputText);  // ✅ inputText passed

  try {
    const response = await fetch(`${API_BASE}/generate-story`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server Error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
