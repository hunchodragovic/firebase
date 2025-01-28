import React, { useState, useEffect } from "react";
import { database } from "./config/firebase-config";
import { collection, getDocs,doc, getDoc,addDoc } from "firebase/firestore";
import "./App.css"
const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [gotAnOscar, setGotAnOscar] = useState(false);

  const moviesCollectionRef = collection(database, "movies");

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
      await addDoc(moviesCollectionRef, newMovie);
      alert("Movie added successfully!");
      setMovieTitle("");
      setReleaseDate("");
      setGotAnOscar(false);
      getMovieList(); // Refresh the movie list
    } catch (error) {
      console.error("Error adding movie:", error.message);
      alert("Failed to add movie: " + error.message);
    }
  };
  

  useEffect(() => {
    getMovieList();
  }, []);

  // Test Firestore connection
  const testFirestore = async () => {
    try {
      // Fetch the first document in the "movies" collection to test Firestore connection
      const snapshot = await getDocs(moviesCollectionRef);
      if (!snapshot.empty) {
        console.log("Firestore is working: true");
      } else {
        console.log("Firestore is working: false");
      }
    } catch (error) {
      console.error("Firestore connection failed:", error.message);
    }
  };
  
  // Call the Firestore test function when the component mounts
  useEffect(() => {
    testFirestore(); // Test Firestore connection
    getMovieList();  // Fetch movie list
  }, []);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Movie Database</h1>

      <div className="movie-info bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Add a New Movie</h2>
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
            onClick={handleAddMovie}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Movie
          </button>
        </div>
      </div>

      <div className="movie-list">
        <h2 className="text-2xl font-semibold mb-4">Movie List</h2>
        {movieList.length > 0 ? (
          <ul className="space-y-4">
            {movieList.map((movie) => (
              <li
                key={movie.id}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <strong className="text-lg">{movie.title}</strong>
                <p>Release Year: {movie.releaseDate}</p>
                <p>Oscar Winner: {movie.receivedAnOscar ? "Yes" : "No"}</p>
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

export default App;
