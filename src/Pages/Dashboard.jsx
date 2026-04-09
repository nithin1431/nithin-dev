import { useContext, useMemo } from "react";
import { AppContext } from "../Context/AppContext";

const Dashboard = () => {

  const { cards } = useContext(AppContext);

  const totalCards = useMemo(() => cards.length, [cards]);

  const recentCards = useMemo(() => {
    return [...cards].slice(-3).reverse();
  }, [cards]);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-blue-500 text-white p-4 rounded mb-4">
        Total Cards: {totalCards}
      </div>

      <h2 className="text-xl mb-2">Recent Cards</h2>

      {recentCards.map(card => (
        <div key={card.id} className="bg-gray-200 p-2 mb-2 rounded">
          {card.title}
        </div>
      ))}

    </div>
  );
};

export default Dashboard;