import React, { useState, useEffect } from "react";
import { database, auth } from "../config/firebase-config";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";  // Import signOut from Firebase Auth
import "../App.css"
const MoviesDatabase = ({ user }) => {
  const [movieList, setMovieList] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [gotAnOscar, setGotAnOscar] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const moviesCollectionRef = collection(database, "movies");

  // Handle sign out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      alert("You have logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out: " + error.message);
    }
  };

  // Fetch movie list from Firestore
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const movies = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovieList(movies);
    } catch (error) {
      console.error("Error fetching movie list:", error.message);
    }
  };

  // Submit new movie to Firestore
  const handleAddMovie = async () => {
    if (!movieTitle || !releaseDate) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      const newMovie = {
        title: movieTitle,
        releaseDate: parseInt(releaseDate, 10),
        receivedAnOscar: gotAnOscar,
      };
      const docRef = await addDoc(moviesCollectionRef, newMovie);
      alert("Movie added successfully!");
      setMovieTitle("");
      setReleaseDate("");
      setGotAnOscar(false);
      getMovieList(); // Refresh the movie list after adding
    } catch (error) {
      console.error("Error adding movie:", error.message);
      alert("Failed to add movie: " + error.message);
    }
  };

  // Delete movie from Firestore
  const handleDeleteMovie = async (id) => {
    try {
      await deleteDoc(doc(database, "movies", id)); // Delete from Firestore
      setMovieList((prevList) => prevList.filter((movie) => movie.id !== id)); // Remove from UI
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error.message);
      alert("Failed to delete movie: " + error.message);
    }
  };

  // Edit movie (set state for editing)
  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieTitle(movie.title);
    setReleaseDate(movie.releaseDate);
    setGotAnOscar(movie.receivedAnOscar);
  };

  // Update movie in Firestore
  const handleUpdateMovie = async () => {
    if (!movieTitle || !releaseDate) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      const updatedMovie = {
        title: movieTitle,
        releaseDate: parseInt(releaseDate, 10),
        receivedAnOscar: gotAnOscar,
      };
      await updateDoc(doc(database, "movies", editingMovie.id), updatedMovie); // Update in Firestore
      setMovieList((prevList) =>
        prevList.map((movie) =>
          movie.id === editingMovie.id ? { ...movie, ...updatedMovie } : movie
        )
      ); // Update in UI
      setEditingMovie(null); // Reset editing state
      alert("Movie updated successfully!");
      setMovieTitle("");
      setReleaseDate("");
      setGotAnOscar(false);
    } catch (error) {
      console.error("Error updating movie:", error.message);
      alert("Failed to update movie: " + error.message);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Movie List</h2>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mb-6"
      >
        Logout
      </button>

      <div className="movie-info bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingMovie ? "Edit Movie" : "Add a New Movie"}</h2>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Movie Title"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            placeholder="Release Year"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={gotAnOscar}
              onChange={(e) => setGotAnOscar(e.target.checked)}
            />
            <label className="text-gray-700">Received an Oscar?</label>
          </div>
          <button
            onClick={editingMovie ? handleUpdateMovie : handleAddMovie}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {editingMovie ? "Update Movie" : "Submit Movie"}
          </button>
        </div>
      </div>

      <div className="movie-list">
        {movieList.length > 0 ? (
          <ul className="space-y-4">
            {movieList.map((movie) => (
              <li key={movie.id} className="p-4 bg-white rounded-lg shadow-md">
                <strong className="text-lg">{movie.title}</strong>
                <p>Release Year: {movie.releaseDate}</p>
                <p>Oscar Winner: {movie.receivedAnOscar ? "Yes" : "No"}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEditMovie(movie)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MoviesDatabase;
