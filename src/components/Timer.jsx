import { useEffect, useState } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa6";

function Timer({ setNewEntry, input, setInput }) {
  const [start, setStart] = useState(false);
  const [startTime, setStartTime] = useState();
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [initTime, setInitTime] = useState(null); // Persisted initial time

  // Function to format milliseconds into the desired time format
  const formatTime = (ms) => {
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hour = Math.floor(ms / 1000 / 60 / 60)
      .toString()
      .padStart(2, "0");
    return `${hour}:${minute}:${second}`;
  };

  const showTimer = (ms) => {
    setTime(formatTime(ms));
  };

  // Define the endTask function correctly
  const endTask = () => {
    setNewEntry({
      id: Date.now(),
      name: input,
      start_time: startTime,
      duration: time,
    }); // Pass data back to App
    setTime("00:00:00");
    setCount(0);
    setInput("");
    setStart(false); // Stop the timer
  };

  useEffect(() => {
    if (!start) {
      return;
    }
    // Record and set the initial start time
    const currentTime = new Date();
    setInitTime(currentTime);

    // Set the formatted start time as the current local time
    const pad = (num, size) => num.toString().padStart(size, "0");

    setStartTime(
      pad(new Date().getHours(), 2) +
        ":" +
        pad(new Date().getMinutes(), 2) +
        ":" +
        pad(new Date().getSeconds(), 2)
    );

    // Timer logic
    const id = setInterval(() => {
      const elapsed = count + (new Date() - currentTime); // Elapsed time
      setCount(elapsed);
      showTimer(elapsed);
    }, 1);

    return () => clearInterval(id);
  }, [start]);

  return (
    <div className="flex items-center">
      <h1 className="w-[11ch] mx-2 p-2 bg-gray-50 rounded-lg shadow-sm text-center">
        {time}
      </h1>
      <div className="flex gap-2">
        {start ? (
          <button
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center"
            onClick={() => setStart(false)}
          >
            <FaPause />
          </button>
        ) : (
          <button
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center"
            onClick={() => setStart(true)}
          >
            <FaPlay />
          </button>
        )}
        <button
          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center"
          onClick={endTask}
        >
          <FaStop />
        </button>
      </div>
    </div>
  );
}

export default Timer;
