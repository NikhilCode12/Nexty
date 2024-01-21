import React, { useEffect, useState } from "react";
import "./app.css";
import { Button } from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import animationData from "./assets/loading.json";
import Lottie from "lottie-react";
import { MdClose } from "react-icons/md";
import Chatbot from "./components/Chatbot";
import bot from "./assets/bot.png";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleButtonClick = () => {
    setButtonClicked(true);
    showToast();
  };

  const showToast = () => {
    toast.info("Didn't see chatbot, its on the right bottom! 🤖👇👉", {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const chatbotClicked = () => {
    setChatbotOpen((prevChatbotOpen) => !prevChatbotOpen);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      setLoading(false);
      clearInterval(timer);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`container ${loading ? "loading" : "loaded"}`}>
      {loading ? (
        <div className="loading-content">
          <div style={{ width: "160px", height: "160px" }}>
            <Lottie animationData={animationData} />
          </div>
          <p style={{ fontSize: "1.25em", color: "whitesmoke" }}>
            Taking you to the next-gen, Nexty in{" "}
            <span style={{ color: "hotpink", fontWeight: "600" }}>
              {countdown}s
            </span>
          </p>
        </div>
      ) : (
        <div
          className={`loaded-content ${chatbotOpen ? "leftshifted cross" : ""}`}
        >
          <p className="heading">
            <span className="animation-text">Welcome to</span>{" "}
            <span style={{ color: "whitesmoke", fontSize: "1.5em" }}>Next</span>
            <span
              style={{
                color: "skyblue",
                fontSize: "1.5em",
                fontWeight: "bold",
              }}
            >
              UI
            </span>{" "}
            <span className="animation-text">Chatbot</span>
          </p>
          <Button
            colorScheme="blue"
            variant="outline"
            borderWidth="1.5px"
            onClick={handleButtonClick}
          >
            {buttonClicked ? "Have a chat" : "Get Started"}
          </Button>
          {buttonClicked && (
            <div
              className={`chatbot-icon ${chatbotOpen ? "cross" : ""}`}
              id="chatbotIcon"
              onClick={chatbotClicked}
            >
              {chatbotOpen ? (
                <MdClose size={24} color="white" />
              ) : (
                <img src={bot} alt="Chatbot" />
              )}
            </div>
          )}
        </div>
      )}
      {chatbotOpen && <Chatbot />}
      <ToastContainer />
    </div>
  );
};

export default App;
