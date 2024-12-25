"use client";

import { useState, useRef } from "react";
import "./globals.css";

export default function Home() {
  const [time, setTime] = useState(0); // Default time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState(""); // Input field value
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const timerRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  // Stop the timer
  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTime(0); // Reset to default 0 seconds
    setIsRunning(false);
  };

  // Handle custom time input
  const handleCustomTimeChange = (e) => {
    let value = e.target.value;

    // Automatically insert ":" after 2 digits
    if (value.length === 2 && !value.includes(":")) {
      value = `${value}:`;
    }

    // Ensure the input is in the correct format MM:SS
    if (value.length <= 5 && (/^\d{0,2}:?\d{0,2}$/.test(value))) {
      setCustomTime(value);
    }
  };

  const setCustomTimer = () => {
    const [minutes, seconds] = customTime.split(":").map((val) => parseInt(val, 10));
    
    // Check if seconds are valid and in the range of 0-59
    if (!isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60) {
      setTime(minutes * 60 + seconds);
      setCustomTime(""); // Clear input field after setting
      setErrorMessage(""); // Clear any previous error message
    } else {
      setErrorMessage("Please enter a valid time in MM:SS format");
    }
  };

  return (
    <div className="container">
      <h1>Timer App</h1>
      <div className="timer-display">{formatTime(time)}</div>

      {/* Input field for custom time */}
      <div className="input-container">
        <input
          type="text"
          value={customTime}
          onChange={handleCustomTimeChange}
          placeholder="00:00"
          className="input"
        />
        <button onClick={setCustomTimer} className="tbutton">
          Set Time
        </button>
      </div>

      {/* Display error message */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="buttons">
        <button onClick={startTimer} className="button">Start</button>
        <button onClick={stopTimer} className="button">Stop</button>
        <button onClick={resetTimer} className="button">Reset</button>
      </div>
    </div>
  );
}
