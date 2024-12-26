"use client";

import { useState, useRef, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [time, setTime] = useState(0); // Default time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(""); // Hours input
  const [minutes, setMinutes] = useState(""); // Minutes input
  const [seconds, setSeconds] = useState(""); // Seconds input
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const timerRef = useRef(null);

  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = timeInSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
    setHours(""); // Clear hours input
    setMinutes(""); // Clear minutes input
    setSeconds(""); // Clear seconds input
    setErrorMessage(""); // Clear any error messages
    localStorage.clear(); // Clear persisted data
  };

  // Handle custom time setting
  const setCustomTimer = () => {
    const hrs = parseInt(hours || "0", 10);
    const mins = parseInt(minutes || "0", 10);
    const secs = parseInt(seconds || "0", 10);

    if (
      hrs >= 0 &&
      mins >= 0 &&
      mins < 60 &&
      secs >= 0 &&
      secs < 60
    ) {
      const totalTime = hrs * 3600 + mins * 60 + secs;
      setTime(totalTime);
      saveToLocalStorage(totalTime, true); // Save time and running state
      setErrorMessage(""); // Clear any previous error message
    } else {
      setErrorMessage("Please enter correct time format");
    }
  };

  // Handle input change with validation for non-negative values
  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setState(value);
    }
  };

  // Save state to localStorage
  const saveToLocalStorage = (time, isRunning) => {
    localStorage.setItem("timerTime", time);
    localStorage.setItem("timerRunning", isRunning);
    localStorage.setItem("startTime", Date.now());
  };

  // Retrieve state from localStorage on page load
  useEffect(() => {
    const savedTime = localStorage.getItem("timerTime");
    const savedRunning = localStorage.getItem("timerRunning");
    const startTime = localStorage.getItem("startTime");

    if (savedTime && savedRunning) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(0, savedTime - timeElapsed);

      setTime(remainingTime);

      if (savedRunning === "true" && remainingTime > 0) {
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
    }
  }, []);

  // Persist the timer state whenever it changes
  useEffect(() => {
    if (isRunning) {
      saveToLocalStorage(time, isRunning);
    }
  }, [time, isRunning]);

  return (
    <div className="container">
      <h1>Timer App</h1>
      <div className="timer-display">{formatTime(time)}</div>

      {/* Input fields for hours, minutes, and seconds */}
      <div className="input-container" ><div className="input-container2">
        <input
          type="text"
          value={hours}
          onChange={(e) => handleInputChange(e, setHours)}
          placeholder="00 h"
          className="input"
        />
        <input
          type="text"
          value={minutes}
          onChange={(e) => handleInputChange(e, setMinutes)}
          placeholder="00 m"
          className="input"
        />
        <input
          type="text"
          value={seconds}
          onChange={(e) => handleInputChange(e, setSeconds)}
          placeholder="00 s"
          className="input"
        /> </div>
        <button onClick={setCustomTimer} className="tbutton">
          Set Time
        </button>
     </div>

      {/* Display error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="buttons">
        <button onClick={startTimer} className="button">Start</button>
        <button onClick={stopTimer} className="button">Pause</button>
        <button onClick={resetTimer} className="button">Reset</button>
      </div>
    </div>
  );
}
