import { memo, useMemo } from "react";

const RatingBreakdown = ({ feedbacks }) => {

  // ✅ Total reviews
  const total = feedbacks.length;

  // ✅ Pre-calculate counts (optimized)
  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    feedbacks.forEach((f) => {
      counts[f.rating] = (counts[f.rating] || 0) + 1;
    });

    return counts;
  }, [feedbacks]);

  return (
    <div className="mt-3 space-y-2 text-sm">

      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratingCounts[star];
        const percent = total ? (count / total) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-2">

            {/* ⭐ Star label */}
            <span className="w-8">{star}★</span>

            {/* 📊 Progress bar */}
            <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-yellow-400 h-2 rounded transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            {/* 🔢 Count */}
            <span className="w-8 text-right text-gray-600">
              {count}
            </span>

          </div>
        );
      })}

    </div>
  );
};

export default memo(RatingBreakdown);