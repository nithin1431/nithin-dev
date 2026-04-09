import { useState, useCallback } from "react";
import Rating from "./Rating";

const FeedbackForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle comment change
  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value);
    if (error) setError(""); // clear error while typing
  }, [error]);

  // ✅ Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Comment must be at least 5 characters");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    onSubmit({ rating, comment: comment.trim() });

    // ✅ Reset form
    setRating(0);
    setComment("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-3">

      {/* ⭐ Rating */}
      <Rating rating={rating} setRating={setRating} />

      {/* 📝 Comment */}
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={handleCommentChange}
        rows="3"
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
      />

      {/* ❌ Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* 🚀 Button */}
      <button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
      >
        Submit Review
      </button>
    </form>
  );
};

export default FeedbackForm;