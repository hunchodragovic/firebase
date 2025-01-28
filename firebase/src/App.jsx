import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase-config";
import Auth from "./components/Auth";
import MoviesDatabase from "./components/MoviesDatabase";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1 className="text-center text-3xl font-bold my-6">Movie App</h1>

      {user ? (
        // Show MoviesDatabase component if the user is logged in
        <MoviesDatabase user={user} />
      ) : (
        // Show Auth component if the user is not logged in
        <Auth />
      )}
    </div>
  );
};

export default App;
