const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// 🔧 Common request handler (REUSABLE)
const handleRequest = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    // Some DELETE APIs return empty body
    if (res.status === 204) return true;

    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // important for UI handling
  }
};

// ✅ GET
export const getCards = async () => {
  return handleRequest(BASE_URL);
};

// ✅ POST
export const createCard = async (card) => {
  return handleRequest(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(card)
  });
};

// ✅ PUT
export const updateCard = async (id, card) => {
  return handleRequest(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(card)
  });
};

// ✅ DELETE
export const deleteCard = async (id) => {
  return handleRequest(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });
};