import Card from "../components/Card";
import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback
} from "react";
import Modal from "../components/Modal";
import { AppContext } from "../Context/AppContext";
import { useNotification } from "../Context/NotificationContext";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard
} from "../Services/Api";

const Cards = () => {

  const { theme, role, cards, setCards } = useContext(AppContext);
  const { addToast } = useNotification();

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(3);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editId, setEditId] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  const [notification, setNotification] = useState(false);

  const prevCardsRef = useRef([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });

  // ✅ VALIDATION STATE
  const [formErrors, setFormErrors] = useState({});

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    let errors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!formData.description || formData.description.trim().length < 3) {
      errors.description = "Description is required";
    }

    if (!formData.image || formData.image.trim() === "") {
      errors.image = "Image URL is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔍 CHANGE DETECTION
  const hasNewData = (oldData, newData) => {
    const oldIds = oldData.map(c => c.id);
    const newIds = newData.map(c => c.id);
    return newIds.some(id => !oldIds.includes(id));
  };

  // 📡 FETCH CARDS
  const fetchCards = useCallback(async (showLoader = false, isManual = false) => {

    if (isManual) console.log("Fetching new data manually...");
    else console.log("Fetching data...");

    try {
      if (showLoader) setLoading(true);
      else setIsFetching(true);

      const data = await getCards();

      const updated = data.slice(0, 6).map(item => ({
        ...item,
        image: `https://picsum.photos/300/200?random=${item.id}`
      }));

      if (prevCardsRef.current.length === 0) {
        setCards(updated);
      } else if (hasNewData(prevCardsRef.current, updated)) {
        console.log("New data detected!");

        setNotification(true);
        addToast("New data available 🚀", "info");

        setCards(updated);
      }

      prevCardsRef.current = updated;

    } catch (err) {
      setError(err.message);
      addToast("Failed to fetch cards", "error");
    } finally {
      if (showLoader) setLoading(false);
      else setIsFetching(false);
    }

  }, [setCards, addToast]);

  // 🚀 INITIAL LOAD
  useEffect(() => {
    fetchCards(true);
  }, [fetchCards]);

  // 🔁 POLLING
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCards();
    }, 10000);

    return () => {
      console.log("Stopped polling");
      clearInterval(interval);
    };
  }, [fetchCards]);

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    setIsSearching(true);

    const timer = setTimeout(() => {
      console.log("Debounced Search Triggered:", searchInput);
      setDebouncedSearch(searchInput);
      setIsSearching(false);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 🔔 AUTO HIDE NOTIFICATION
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 🔄 MANUAL REFRESH
  const handleRefresh = useCallback(() => {
    fetchCards(true, true);
    setNotification(false);
    addToast("Data refreshed", "info");
  }, [fetchCards, addToast]);

  // ❌ DELETE
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteCard(id);
      setCards(prev => prev.filter(card => card.id !== id));
      addToast("Card deleted", "warning");
    } catch (err) {
      setError(err.message);
      addToast("Delete failed", "error");
    }
  }, [setCards, addToast]);

  // ✏️ EDIT
  const handleEdit = useCallback((card) => {
    setFormData({
      title: card.title,
      description: card.body,
      image: card.image
    });
    setEditId(card.id);
  }, []);

  // ➕ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        const updatedCard = await updateCard(editId, {
          title: formData.title,
          body: formData.description,
          image: formData.image
        });

        setCards(cards.map(card =>
          card.id === editId
            ? { ...updatedCard, image: formData.image }
            : card
        ));

        setEditId(null);
        addToast("Card updated successfully", "info");

      } else {
        const newCard = await createCard({
          title: formData.title,
          body: formData.description,
          image: formData.image
        });

        const newData = [{ ...newCard, image: formData.image }, ...cards];

        setCards(newData);
        setNotification(true);
        addToast("Card added successfully", "success");

        prevCardsRef.current = newData;
      }

      setFormData({
        title: "",
        description: "",
        image: ""
      });

      setFormErrors({});

    } catch (err) {
      setError(err.message);
      addToast("Something went wrong", "error");
    }
  };

  // 🔍 FILTER
  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      (card.title || "").toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
  }, [cards, debouncedSearch]);

  // 🔽 SORT
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      if (sortOrder === "asc") return a.title.localeCompare(b.title);
      if (sortOrder === "desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [filteredCards, sortOrder]);

  // 📄 PAGINATION
  const currentCards = useMemo(() => {
    const indexOfLast = currentPage * cardsPerPage;
    const indexOfFirst = indexOfLast - cardsPerPage;
    return sortedCards.slice(indexOfFirst, indexOfLast);
  }, [sortedCards, currentPage, cardsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedCards.length / cardsPerPage);
  }, [sortedCards, cardsPerPage]);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error}</h2>;

  return (
    <div className={`min-h-screen px-4 py-10 ${theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-black"}`}>

      {notification && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white p-3 text-center z-50 flex justify-center items-center gap-4 shadow-md">
          🚀 New data available!
          <button onClick={handleRefresh} className="bg-white text-green-600 px-4 py-1 rounded-md">
            Refresh
          </button>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-6">
        Cards Section
      </h1>

      {/* 🔄 REFRESH */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Refresh Data
        </button>
      </div>

      {/* ✅ BACKGROUND FETCHING (RESTORED) */}
      {isFetching && (
        <p className="text-center text-gray-400 mb-2">
          Updating data...
        </p>
      )}

      {/* FORM WITH VALIDATION */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <input type="text" placeholder="Title" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border p-2 rounded-md w-full" />
              {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
            </div>

            <div>
              <input type="text" placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border p-2 rounded-md w-full" />
              {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
            </div>

            <div>
              <input type="text" placeholder="Image URL" value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="border p-2 rounded-md w-full" />
              {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
            </div>

            <button className="bg-blue-600 text-white p-2 rounded-md">
              {editId ? "Update Card" : "Add Card"}
            </button>
          </form>
        </div>
      )}

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <input type="text" placeholder="Search..." value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-4 py-2 rounded-md w-64" />

        <select value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded-md">
          <option value="">Sort By</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      {isSearching && <p className="text-center text-gray-500 mb-4">Searching...</p>}
      {!isSearching && currentCards.length === 0 &&
        <p className="text-center text-red-400 text-lg font-semibold mt-6">
          No cards found
        </p>}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentCards.map(card => (
          <Card
            key={card.id}
            {...card}
            openModal={setSelectedCard}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          className="px-5 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span>
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-5 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedCard && (
        <Modal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

    </div>
  );
};

export default Cards;