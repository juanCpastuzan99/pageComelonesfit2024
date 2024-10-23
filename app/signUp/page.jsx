"use client"
import { auth } from '../firebase/firebaseConfig'; // Adjust path as necessary
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User created successfully:', user);
            // You can handle additional logic like saving the firstName and lastName in the database
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };

    return (
        <div>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="inputFirstname" className="form-label">FirstName</label>
                    <input type="text" className="form-control" id="inputFirstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputLastname" className="form-label">LastName</label>
                    <input type="text" className="form-control" id="inputLastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
