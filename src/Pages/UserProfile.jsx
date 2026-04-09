import { useState, useEffect, useContext } from "react";
import { AppContext } from "../Context/AppContext";

function UserProfile() {
  const { theme, toggleTheme } = useContext(AppContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: ""
  });

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userProfile"));
    if (saved) setProfile(saved);
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({ ...profile, [name]: value });

    // Clear error while typing
    setErrors({ ...errors, [name]: "" });
  };

  // HANDLE IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({ ...profile, image: reader.result });
    };

    if (file) reader.readAsDataURL(file);
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { name: "", email: "" };

    if (!profile.name) {
      newErrors.name = "Enter Name";
    }

    if (!profile.email) {
      newErrors.email = "Enter Email";
    }

    setErrors(newErrors);

    // Stop if errors exist
    if (newErrors.name || newErrors.email) return;

    localStorage.setItem("userProfile", JSON.stringify(profile));

    setMessage("✅ Profile Saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-lg w-full max-w-md border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-4">
          👤 User Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            {profile.image ? (
              <img
                src={profile.image}
                alt="profile"
                className="w-24 h-24 rounded-full border object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-2">
                👤
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="text-sm text-gray-600 dark:text-gray-300
              file:mr-2 file:py-1 file:px-3
              file:rounded file:border-0
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>

          {/* NAME */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={profile.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded 
              ${errors.name ? "border-red-500" : ""}
              bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={profile.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded 
              ${errors.email ? "border-red-500" : ""}
              bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* THEME BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded"
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded"
          >
            Save Profile
          </button>

          {/* SUCCESS MESSAGE */}
          {message && (
            <p className="text-center text-green-500 text-sm">{message}</p>
          )}

        </form>
      </div>
    </div>
  );
}

export default UserProfile;