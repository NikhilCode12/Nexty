import React from "react";
import { motion } from "framer-motion";

const Status = ({ isOnline, mode }) => {
  const dotColor = isOnline ? "lime" : "red";

  return (
    <motion.div
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: dotColor,
        border: `1px solid ${mode === "light" ? "gray" : "white"}`,
        filter: "blur(0.5px)",
      }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
      }}
    />
  );
};

export default Status;
