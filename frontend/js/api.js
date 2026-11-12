const API_BASE_URL = "http://127.0.0.1:8000";

export async function extractPdf(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/extract`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.detail || `擷取失敗（HTTP ${response.status}）`);
  }
  return response.json();
}
