import React, { useRef } from "react";
import { Button } from "@mui/material";
import ReactCanvasConfetti from "react-canvas-confetti";

const TestConfetti = () => {
  const confettiRef = useRef(null);

  const fireConfetti = () => {
    console.log("Firing Confetti");
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 200,
        spread: 120,
        origin: { x: 0.5, y: 0.5 },
        ticks: 50,
      });
    }
  };

  return (
    <div>
      <ReactCanvasConfetti
        refConfetti={(confetti) => (confettiRef.current = confetti)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Prevents the canvas from blocking clicks
        }}
      />
      <Button variant="contained" onClick={fireConfetti}>
        Fire Confetti
      </Button>
    </div>
  );
};

export default TestConfetti;
