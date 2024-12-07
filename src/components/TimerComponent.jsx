import { useState, useRef, useImperativeHandle, forwardRef } from "react";

const TimerComponent = forwardRef(({ onTimerEnd }, ref) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);

    const endTime = Date.now() + timeLeft * 1000;
    timerRef.current = setInterval(() => {
      const remainingTime = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        if (onTimerEnd) onTimerEnd();
      }
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(20);
    setIsRunning(false);
    startTimer();
  };

  useImperativeHandle(ref, () => ({
    startTimer,
    resetTimer,
  }));

  return (
    <div className="flex items-center justify-center w-fit h-fit font-semibold text-xs">
      00:{timeLeft}
    </div>
  );
});

TimerComponent.displayName = "TimerComponent";
export default TimerComponent;
