import { memo, useCallback } from "react";

const FeedbackList = ({ feedbacks, onDelete }) => {

  // ✅ Memoized delete handler
  const handleDelete = useCallback((index) => {
    onDelete(index);
  }, [onDelete]);

  if (!feedbacks.length) {
    return (
      <p className="text-gray-400 text-sm text-center">
        No reviews yet
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-3 max-h-40 overflow-y-auto pr-1">

      {feedbacks.map((fb, index) => (
        <div
          key={`${fb.comment}-${index}`}
          className="border-b pb-2 flex justify-between items-start hover:bg-gray-50 p-2 rounded transition"
        >

          {/* ⭐ LEFT SIDE */}
          <div>
            <div className="text-yellow-500 text-sm">
              {"★".repeat(fb.rating)}
              {"☆".repeat(5 - fb.rating)}
            </div>

            <p className="text-sm text-gray-700 break-words">
              {fb.comment}
            </p>
          </div>

          {/* ❌ DELETE */}
          <button
            onClick={() => handleDelete(index)}
            className="text-red-500 text-xs hover:underline ml-2"
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
};

export default memo(FeedbackList);