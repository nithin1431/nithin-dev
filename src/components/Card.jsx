import { useContext, memo, useMemo, useCallback } from "react";
import { AppContext } from "../Context/AppContext";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";
import RatingBreakdown from "./RatingBreakdown";
import useFeedback from "../hooks/useFeedback"; // ✅ NEW

function Card({ id, title, body, image, openModal, onEdit, onDelete }) {
  const { role } = useContext(AppContext);

  // ✅ Use custom hook (instead of local state)
  const { feedbacks, addFeedback, deleteFeedback } = useFeedback(id);

  // ✅ Optimized average rating
  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;

    const avg =
      feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
      feedbacks.length;

    return avg.toFixed(1);
  }, [feedbacks]);

  // ✅ Avoid inline functions
  const handleView = useCallback(() => {
    openModal({ id, title, body, image });
  }, [id, title, body, image, openModal]);

  const handleEditClick = useCallback(() => {
    onEdit({ id, title, body, image });
  }, [id, title, body, image, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className="bg-white shadow rounded p-4 space-y-3 hover:scale-105 transition">

      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded"
      />

      {/* TITLE */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* DESCRIPTION */}
      <p className="text-gray-600">{body}</p>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleView}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
        >
          View
        </button>

        {role === "admin" && (
          <>
            <button
              onClick={handleEditClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* ⭐ RATING */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg">{averageRating}</p>

          <div className="text-yellow-400">
            {"★".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </div>

          <span className="text-sm text-gray-500">
            ({feedbacks.length} reviews)
          </span>
        </div>

        {/* 📊 Breakdown */}
        <RatingBreakdown feedbacks={feedbacks} />
      </div>

      {/* 📝 FEEDBACK FORM */}
      <FeedbackForm onSubmit={addFeedback} />

      {/* 📃 FEEDBACK LIST */}
      <FeedbackList
        feedbacks={feedbacks}
        onDelete={deleteFeedback}
      />
    </div>
  );
}

export default memo(Card);