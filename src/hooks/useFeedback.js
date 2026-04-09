import { useState, useEffect } from "react";

const useFeedback = (id) => {
  const [feedbacks, setFeedbacks] = useState([]);

  // 🔄 Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`feedback-${id}`)) || [];
    setFeedbacks(saved);
  }, [id]);

  // ➕ Add feedback
  const addFeedback = (data) => {
    const updated = [...feedbacks, data];
    setFeedbacks(updated);
    localStorage.setItem(`feedback-${id}`, JSON.stringify(updated));
  };

  // ❌ Delete feedback
  const deleteFeedback = (index) => {
    const updated = feedbacks.filter((_, i) => i !== index);
    setFeedbacks(updated);
    localStorage.setItem(`feedback-${id}`, JSON.stringify(updated));
  };

  return {
    feedbacks,
    addFeedback,
    deleteFeedback
  };
};

export default useFeedback;