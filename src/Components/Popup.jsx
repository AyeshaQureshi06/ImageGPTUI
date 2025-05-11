'use client'

import React, { useState } from 'react';

// import { useUserContext } from '../../../context/UserContext';

// import { addUser, loginUser } from '../../api';

const Popup = ({ onClose, setLoggedIn, setUserImage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
      console.log(image)
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      pwd: password,
    };

    try {
      const result = await loginUser(userData); // This should be an API call to verify login
      console.log(result);

      // Create a user object
      const user = {
        name: result.name,
        email: result.email,
        userImage: result.image || '/default-avatar.png',
      };

      // Store the entire user object in localStorage under 'user'
      localStorage.setItem('user', JSON.stringify(user));

      // Update context values when login is successful
      setLoggedIn(true); // Set user as logged in
      setUserImage(result.userImage || '/default-avatar.png'); // Set user image if available
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      // onClose(); // Close the popup on success
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      pwd: password,
      image: imagePreview || '', // Send image preview URL or empty string
    };

    try {
      const result = await addUser(userData);
      console.log(result.message);

      // Create a user object
      const user = {
        name,
        email,
        userImage: imagePreview || '/default-avatar.png', // Set the image URL or default
      };

      // Store the entire user object in localStorage under 'user'
      localStorage.setItem('user', JSON.stringify(user));

      onClose(); // Close popup on success
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 max-w-md text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-2xl">
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-black text-center">{isLogin ? 'Login' : 'Create an Account'}</h2>



        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2 text-black">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-2 text-black">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-500 py-2 rounded font-bold text-white">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm mb-2 text-black">Full Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2 text-black">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-2 text-black">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm mb-2 text-black">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm mb-2 text-black">Profile Image:</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-black"
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-16 h-16 rounded-full" />}
            </div>

            <button type="submit" className="w-full bg-blue-500 py-2 rounded font-bold text-white">
              Sign Up
            </button>
          </form>
        )}

        <p className="text-center mt-4 text-black">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-500 underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-500 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Popup;
