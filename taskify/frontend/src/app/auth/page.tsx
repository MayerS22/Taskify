"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, register } from "../api";

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  // Sign In state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginShowModal, setLoginShowModal] = useState(false);
  const [loginShowErrorModal, setLoginShowErrorModal] = useState(false);
  // Sign Up state
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [signupError, setSignupError] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupShowConfirmPassword, setSignupShowConfirmPassword] = useState(false);
  const [signupShowModal, setSignupShowModal] = useState(false);

  // Handlers for sign in
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginError("");
  };
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setLoginError("All fields are required.");
      setLoginShowErrorModal(true);
      setTimeout(() => setLoginShowErrorModal(false), 1300);
      return;
    }
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.access_token) {
        setLoginError("");
        setLoginShowModal(true);
        setTimeout(() => {
          setLoginShowModal(false);
          router.push("/homepage");
        }, 1300);
      } else if (result.message) {
        setLoginError(result.message);
        setLoginShowErrorModal(true);
        setTimeout(() => setLoginShowErrorModal(false), 1300);
      } else {
        setLoginError("Unknown error occurred.");
        setLoginShowErrorModal(true);
        setTimeout(() => setLoginShowErrorModal(false), 1300);
      }
    } catch {
      setLoginError("Network or server error.");
      setLoginShowErrorModal(true);
      setTimeout(() => setLoginShowErrorModal(false), 1300);
    }
  };

  // Handlers for sign up
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setSignupError("");
  };
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setSignupError("All fields are required.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    try {
      const result = await register(signupForm.email, signupForm.password, signupForm.firstName, signupForm.lastName);
      if (result.userId) {
        setSignupError("");
        setSignupShowModal(true);
        setTimeout(() => {
          setSignupShowModal(false);
          setIsSignIn(true);
        }, 1300);
      } else if (result.message) {
        setSignupError(result.message);
      } else {
        setSignupError("Unknown error occurred.");
      }
    } catch {
      setSignupError("Network or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <style>{`
        .flip-card {
          perspective: 1200px;
        }
        .flip-card-inner {
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        @keyframes modalBounceIn { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.05); } 80% { transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
        .animate-modalBounceIn { animation: modalBounceIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes iconPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-iconPop { animation: iconPop 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>
      <div className={`flip-card relative w-full max-w-3xl h-[600px] md:h-[520px] ${isSignIn ? "" : "flipped"}`}> 
        <div className="flip-card-inner w-full h-full relative" key={isSignIn ? 'signin' : 'signup'}>
          {/* Sign In Side */}
          <div className="flip-card-front bg-neutral-900 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-800 w-full h-full">
            {/* Image right */}
            <div className="hidden md:flex items-center justify-center bg-black p-16 md:w-[480px] rounded-none md:rounded-r-3xl">
              <Image
                src="/assets/SignIn.svg"
                alt="Sign In Illustration"
                width={380}
                height={380}
                className="w-full h-auto max-w-lg"
                priority
              />
            </div>
            {/* Form left */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
              <div className="w-full max-w-lg bg-neutral-950/90 rounded-2xl shadow-xl border border-gray-800 p-10 flex flex-col items-center">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-4xl font-extrabold text-white mb-2">Sign In</h2>
                  <p className="text-gray-400 text-base text-center">Welcome back! Please sign in to continue.</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6 w-full">
                  <div>
                    <label className="block mb-1 font-medium text-gray-200">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative min-w-0">
                    <label className="block mb-1 font-medium text-gray-200">Password</label>
                    <input
                      type={loginShowPassword ? "text" : "password"}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-black rounded-full focus:outline-none p-1 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => setLoginShowPassword((v) => !v)}
                      aria-label={loginShowPassword ? "Hide password" : "Show password"}
                    >
                      {loginShowPassword ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="/auth/forgot-password" className="text-gray-400 hover:underline text-sm font-medium">Forgot Password?</a>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:from-black hover:to-black hover:bg-black hover:text-white transition mt-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Sign In
                  </button>
                  <div className="text-center mt-2 text-gray-400 text-base">
                    Don&apos;t have an account?{' '}
                    <button type="button" className="text-white hover:underline font-medium" onClick={() => setIsSignIn(false)}>
                      Sign up
                    </button>
                  </div>
                  {loginError && <div className="text-red-400 text-center mt-3 text-base font-semibold bg-red-900/30 rounded-lg py-2 px-3 border border-red-700 animate-modalBounceIn">{loginError}</div>}
                </form>
              </div>
            </div>
          </div>
          {/* Sign Up Side */}
          <div className="flip-card-back bg-neutral-900 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-800 w-full h-full">
            {/* Image right */}
            <div className="hidden md:flex items-center justify-center bg-black p-16 md:w-[480px] rounded-none md:rounded-r-3xl">
              <Image
                src="/assets/SignUp.svg"
                alt="Sign Up Illustration"
                width={380}
                height={380}
                className="w-full h-auto max-w-lg"
                priority
              />
            </div>
            {/* Form left */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
              <div className="w-full max-w-lg bg-neutral-950/90 rounded-2xl shadow-xl border border-gray-800 p-10 flex flex-col items-center">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-4xl font-extrabold text-white mb-2">Sign Up</h2>
                  <p className="text-gray-400 text-base text-center">Create your account to get started.</p>
                </div>
                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-6 w-full">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-gray-200">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={signupForm.firstName}
                        onChange={handleSignupChange}
                        className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-gray-200">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={signupForm.lastName}
                        onChange={handleSignupChange}
                        className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-200">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative min-w-0">
                    <label className="block mb-1 font-medium text-gray-200">Password</label>
                    <input
                      type={signupShowPassword ? "text" : "password"}
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-black rounded-full focus:outline-none p-1 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => setSignupShowPassword((v) => !v)}
                      aria-label={signupShowPassword ? "Hide password" : "Show password"}
                    >
                      {signupShowPassword ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="relative min-w-0">
                    <label className="block mb-1 font-medium text-gray-200">Confirm Password</label>
                    <input
                      type={signupShowConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      className="w-full border border-gray-700 bg-black rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500 text-lg"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-black rounded-full focus:outline-none p-1 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => setSignupShowConfirmPassword((v) => !v)}
                      aria-label={signupShowConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {signupShowConfirmPassword ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125" /></svg>
                      ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:from-black hover:to-black hover:bg-black hover:text-white transition mt-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Sign Up
                  </button>
                  <div className="text-center mt-2 text-gray-400 text-base">
                    Already have an account?{' '}
                    <button type="button" className="text-white hover:underline font-medium" onClick={() => setIsSignIn(true)}>
                      Log in
                    </button>
                  </div>
                  {signupError && <div className="text-red-400 text-center mt-3 text-base font-semibold bg-red-900/30 rounded-lg py-2 px-3 border border-red-700 animate-modalBounceIn">{signupError}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 