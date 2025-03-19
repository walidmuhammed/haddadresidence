"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Function to get the initial countdown state instantly
const getInitialCountdown = () => {
  let targetDate = localStorage.getItem("targetDate");

  if (!targetDate) {
    targetDate = new Date(2025, 4, 15, 0, 0, 0, 0).getTime().toString();
    localStorage.setItem("targetDate", targetDate);
  }

  const now = new Date().getTime();
  const distance = parseInt(targetDate) - now;

  return distance > 0
    ? {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      }
    : { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export default function Home() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCountdown(getInitialCountdown());
  }, []);

  useEffect(() => {
    // Function to check screen size and update background
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile: <= 768px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = parseInt(localStorage.getItem("targetDate")!);
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      toast.success("Thank you for subscribing! Please check your email.");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while subscribing"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={isMobile ? "/images/mobile.png" : "/images/background.png"}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-10 md:px-20 lg:px-32 xl:px-48 flex flex-col">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="https://i.imgur.com/61Z8eZV.png"
            alt="Logo"
            width={120}
            height={120}
            priority
            unoptimized
          />
        </div>

        {/* Heading and Text */}
        <p className="text-red-600 text-lg tracking-wide mb-2">
          — OUR WEBSITE IS UNDER CONSTRUCTION
        </p>
        <h1 className="text-6xl font-normal leading-tight mb-4">COMING SOON</h1>
        <p className="text-lg mb-10 leading-relaxed">
          Get the latest news by subscribing to the newsletter.
        </p>

        {/* Email Subscription Form */}
        <form onSubmit={handleSubmit} className="email-form mb-10">
          <div className="relative flex w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail."
              className="email-input"
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <Mail className="mail-icon" fill="#434343" color="#fff" size={24} />
            </button>
          </div>
        </form>

        {/* Countdown Timer */}
        <div className="flex gap-8">
          {["days", "hours", "minutes", "seconds"].map((unit, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl font-bold tracking-wide">
                {String(countdown[unit as keyof typeof countdown]).padStart(
                  2,
                  "0"
                )}
              </div>
              <div className="text-red-500 text-sm lowercase tracking-wide">
                {unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
