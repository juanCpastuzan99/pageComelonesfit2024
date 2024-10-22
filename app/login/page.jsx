"use client"
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../login/firebase/firebaseConfig"; // Ajusta la ruta
import { useRouter } from "next/router";

const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario autenticado:", user);

    } catch (err) {
      setError(err.message);
      console.error("Error de autenticación:", err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado con Google:", user);
      window.alert("Bienvenidos")
      
      

    } catch (err) {
      setError(err.message);
      console.error("Error de autenticación con Google:", err);
    }
     

  };

  return (
    <div className="container-fluid p-lg-5">
      <form onSubmit={handleEmailLogin}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary text-bg-dark alert-success">Submit</button>
      </form>
      <button onClick={handleGoogleLogin} className="btn btn-danger mt-3">Iniciar sesión con Google</button>
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Login;
