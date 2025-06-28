"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

const Login = () => {
  const { data: session } = useSession();

  // Store user email in localStorage when session is available
  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem("userEmail", session.user.email);
    }
  }, [session]);

  const handleSignIn = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="flex flex-col bg-[#FCF6F5FF] flex-1 items-center gap-5 justify-center h-screen md:h-[100vh] relative">
      <div className="sm:hidden flex absolute top-5  flex-row w-full text-black items-start font-semibold text-2xl p-5 ">
        <a href="/chat">IslamicGPT <span className="font-light">(beta)</span></a>
      </div>

      <h3 className="text-black text-3xl mt-16">Get Started</h3>
      <div className="flex md:flex-row flex-col gap-3">
        <button
          className="border flex text-black px-5 gap-3 py-3 cursor-pointer rounded-lg"
          onClick={() => handleSignIn("google")}
        >
          <img src="\google.svg" alt="" className="w-6 h-6" />
          Continue with Google
        </button>
        {/* <button
          className="border flex text-black bg-white px-5 gap-3 py-3 rounded-lg"
          onClick={() => handleSignIn("github")}
        >
          <img src="/github.svg" alt="" className="w-6 h-6" />
          Continue with Github
        </button> */}
      </div>

      <div className="absolute bottom-20 md:bottom-5 flex flex-col items-center justify-center text-black gap-2">
        <div className="flex flex-row gap-5">
          <a href="/condition">Term of use</a>
          <a href="/policy">Privacy Policy</a>
          <a href="/about">About</a>
        </div>
        <div className='w-full text-black py-3 flex gap-1 items-center justify-center'>
          <span>Powered by</span>
          <a
            href="https://PixelToProse.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all duration-300"
          >
            PixelToProse
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
