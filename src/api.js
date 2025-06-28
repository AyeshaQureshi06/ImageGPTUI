export const API_BASE = "http://127.0.0.1:5000";

// 📘 Generate story from image and mood
export async function generateStoryFromImage(imageFile, mood, inputText, email) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("mood", mood);
  formData.append("input_text", inputText); // 👈 Input for prompt context
  formData.append("email", email);

  try {
    const response = await fetch(`${API_BASE}/generate-story`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server Error");
    }

    // Response includes: { caption, story, title, user }
    return data;
  } catch (error) {
    console.error("API Error in generateStoryFromImage:", error);
    throw error;
  }
}

// 💬 Ask question about the generated story
export async function askQuestionAboutStory(question, email) {
  const requestBody = { question, email };

  try {
    const response = await fetch(`${API_BASE}/ask-question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server Error");
    }

    return data; // { answer }
  } catch (error) {
    console.error("API Error in askQuestionAboutStory:", error);
    throw error;
  }
}

// 📚 Get story history for a user
export async function getUserHistory(email) {
  try {
    const response = await fetch(`${API_BASE}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server Error");
    }

    return data.history; // List of { chat_id, question, answer, prompt, image, etc. }
  } catch (error) {
    console.error("API Error in getUserHistory:", error);
    throw error;
  }
}
