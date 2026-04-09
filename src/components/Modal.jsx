import { memo } from "react";

const Modal = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4">
      
      <div className="bg-white p-6 rounded-lg max-w-md w-full">

        <img
          src={card.image}
          alt={card.title}
          className="w-full h-48 object-cover rounded"
        />

        <h2 className="text-xl font-bold mt-4">{card.title}</h2>

        <p className="mt-2 text-gray-600">{card.body}</p>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default memo(Modal);