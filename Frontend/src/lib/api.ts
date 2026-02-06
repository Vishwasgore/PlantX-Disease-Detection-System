export async function analyzePlantImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze image");
  }

  return await response.json();
}
