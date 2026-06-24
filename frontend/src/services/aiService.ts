const API_URL = "http://127.0.0.1:8000";

export const generateHint = async (transcript: string) => {
  const response = await fetch(`${API_URL}/ai/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript,
    }),
  });

  return response.json();
};

export const detectMisconception = async (transcript: string) => {
  const response = await fetch(`${API_URL}/ai/misconception`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript,
    }),
  });

  return response.json();
};

export const getNextStep = async (transcript: string) => {
  const response = await fetch(`${API_URL}/ai/next-step`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript,
    }),
  });

  return response.json();
};