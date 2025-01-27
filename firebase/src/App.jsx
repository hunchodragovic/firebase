import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import { database } from "./config/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const App = () => {
  const [movieList, setMovieList] = useState([]);

  const getMovieList = async () => {
    try {
      // Reference the "movies" collection in Firestore
      const moviesCollectionRef = collection(database, "movies");

      // Fetch all documents from the collection
      const data = await getDocs(moviesCollectionRef);


      // Map through the documents and extract the data
      const movies = data.docs.map((doc) => ({
        id: doc.id, // Include the document ID if needed
        ...doc.data(), // Spread the movie data fields
      
      }));

      // Update state with the retrieved movies
      setMovieList(movies);
    } catch (error) {
      console.error("Error fetching movie list:", error.message);
    }
  };

  // Fetch movie list when the component loads
  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div>
     
      <div className="movie-list">
        <h2>Movie List</h2>
        {movieList.length > 0 ? (
          <ul>
            {movieList.map((movie) => (
              <li key={movie.id}>
                <strong>{movie.title}</strong> -
                <h2> {movie.releaseDate}</h2>
                <h2>{movie.receiverAnOscar}</h2>
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
