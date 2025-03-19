import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase";

function App() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let targetDate = localStorage.getItem("targetDate");

    if (!targetDate) {
      targetDate = new Date(2025, 4, 15, 0, 0, 0, 0).getTime().toString();
      localStorage.setItem("targetDate", targetDate);
    }
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(targetDate) - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      // Clear the interval once the countdown is finished
      if (distance <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("subscribers").insert([{ email }]);

      if (error) throw error;

      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("This email is already registered or an error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-texture flex items-center">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <img
          src="https://i.imgur.com/61Z8eZV.png"
          alt="Haddad Residence Logo"
          className="w-21 mb-20 ml-20"
        />

        <div className="max-w-4xl ml-20">
          <p className="text-red-600 text-md mb-2">
            — OUR WEBSITE IS UNDER CONSTRUCTION
          </p>
          <h1 className="text-5xl font-regular mb-3">COMING SOON</h1>
          <p className="text-base mb-10">
            Get the latest news by subscribing to the newsletter.
          </p>

          <form onSubmit={handleSubmit} className="flex mb-12 email-form">
            <div className="relative flex w-full max-w-sm">
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
                <Mail
                  className="mail-icon"
                  fill="#000"
                  color="#fff"
                  size={24}
                />
              </button>
            </div>
          </form>

          <div className="flex gap-5">
            <div className="text-center">
              <div className="countdown-value">
                {String(countdown.days).padStart(2, "0")}
              </div>
              <div className="countdown-label">days</div>
            </div>
            <div className="text-center">
              <div className="countdown-value">
                {String(countdown.hours).padStart(2, "0")}
              </div>
              <div className="countdown-label">hours</div>
            </div>
            <div className="text-center">
              <div className="countdown-value">
                {String(countdown.minutes).padStart(2, "0")}
              </div>
              <div className="countdown-label">minutes</div>
            </div>
            <div className="text-center">
              <div className="countdown-value">
                {String(countdown.seconds).padStart(2, "0")}
              </div>
              <div className="countdown-label">seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
