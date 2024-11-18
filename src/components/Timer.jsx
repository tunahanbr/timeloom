import { useEffect, useState } from "react";
import { FaPlay,FaPause,FaStop } from "react-icons/fa6";

function Timer() {
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("00:00:00:00");
  const [timeSetting, setTimeSetting] = useState({ m: 0, s: 0 });

  var initTime = new Date();

  const showTimer = (ms) => {
    const milliseconds = Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0");
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hour = Math.floor(ms / 1000 / 60 / 60).toString();
    setTime(
      hour.padStart(2, "0") +
      ":" +
      minute + ":" + second + ":" + milliseconds
    );
  };

  const endTask = () => {
    setTime("00:00:00:00");
    setCount(0);
  };

  useEffect(() => {
    if (!start) {
      return;
    }
    var id = setInterval(() => {
      var left = count + (new Date() - initTime);
      setCount(left);
      showTimer(left);
      if (left <= 0) {
        setTime("00:00:00:00");
        clearInterval(id);
      }
    }, 1);
    return () => clearInterval(id);
  }, [start]);

  return (
    <>
      <div className="flex items-center">
      <h1 className="w-[11ch] mx-2 p-2 bg-gray-50 rounded-lg shadow-sm text-center">{time}</h1>
      <div className="flex gap-2">
      {start ? (
        <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center" onClick={() => setStart(false)}>
          <FaPause />
        </button>
      ) : (
        <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center" onClick={() => setStart(true)}>
          <FaPlay  />
        </button>
      )}
      <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm text-center" onClick={endTask}>
      <FaStop />
      </button>
      </div>
      </div>
    </>
  );
}

export default Timer;
