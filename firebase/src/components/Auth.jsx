import React, { useState } from "react";
import { auth } from "../config/firebase-config";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("User signed in with Google:", userCredential.user);
      setUser(userCredential.user); // Update the user state
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      setUser(userCredential.user); // Update the user state
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out.");
      setUser(null); // Clear the user state
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!user ? (
          <>
            <h1 className="auth-title">Login</h1>
            <div className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <button onClick={signIn} className="auth-button">
                Login
              </button>
              <button onClick={signInWithGoogle} className="auth-button">
                Login with Google
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Welcome, {user.email}!</h1>
            <button onClick={handleLogout} className="auth-button logout-button">
              Logout
            </button>
          </>
        )}
      </div>
      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f4;
        }

        .auth-card {
          background: white;
          padding: 20px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .auth-title {
          text-align: center;
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .auth-input {
          padding: 10px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .auth-input:focus {
          border-color: #007bff;
        }

        .auth-button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .auth-button:hover {
          background-color: #0056b3;
        }

        .logout-button {
          background-color: #dc3545;
        }

        .logout-button:hover {
          background-color: #a71d2a;
        }
      `}</style>
    </div>
  );
};

export default Auth;
