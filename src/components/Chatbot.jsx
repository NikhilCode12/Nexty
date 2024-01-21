import React, { useEffect, useState, useRef } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import bot from "../assets/bot.png";
import Status from "./Status";
import Chat from "./Chat";
import { app } from "../firebase";
import {
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  Switch,
  Input,
  InputGroup,
  InputRightElement,
  ChakraProvider,
  extendTheme,
  useColorMode,
  ColorModeScript,
  ColorModeProvider,
} from "@chakra-ui/react";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
// import { sendMessageToOpenAI } from "../openai";
const customTheme = extendTheme({
  colors: {
    light: {
      primary: "#3498db",
      secondary: "#2ecc71",
      background: "#ecf0f1",
      text: "#2c3e50",
      inputBg: "lightgray",
      sendButtonBg: "green.400",
      sendButtonColor: "black",
    },
    dark: {
      primary: "#2980b9",
      secondary: "#27ae60",
      background: "#2c3e50",
      text: "#ecf0f1",
      inputBg: "#2c3e50",
      sendButtonBg: "green.600",
      sendButtonColor: "white",
    },
  },
});

const MotionBox = motion(Box);
const db = getFirestore(app);

const Chatbot = () => {
  const firebase_query = query(
    collection(db, "Messages"),
    orderBy("createdAt", "asc")
  );
  const divRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const isOnline = false;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // const res = await sendMessageToOpenAI(message);
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        msg: message,
        createdAt: serverTimestamp(),
        isBot: false,
      });
      // await addDoc(collection(db, "Messages"), {
      //   msg: res.message,
      //   createdAt: serverTimestamp(),
      //   isBot: true,
      // });
      divRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const removedState = onSnapshot(firebase_query, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      removedState();
    };
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      <ColorModeProvider>
        <MotionBox
          p={4}
          bg={colorMode === "light" ? "light.background" : "dark.background"}
          color={colorMode === "light" ? "light.text" : "dark.text"}
          position="absolute"
          right="20px"
          w={"300px"}
          h={"470px"}
          borderRadius={10}
          bottom="40px"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -60 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          border={
            colorMode === "light" ? "solid lightgray 2px" : "solid #ecf0f1 2px"
          }
        >
          <HStack
            spacing={4}
            align="center"
            justify="space-between"
            bg={colorMode === "light" ? "lightgray" : "skyblue"}
            p="2"
            borderRadius={10}
          >
            <HStack spacing={2} align="center">
              <Avatar src={bot} alt="Nextbot" />
              <VStack align="flex-start" spacing={0}>
                <Text
                  fontWeight="bold"
                  color={colorMode === "dark" ? "dark.background" : "black"}
                >
                  Nexty
                </Text>
                <HStack>
                  <Status isOnline={isOnline} mode={colorMode} />
                  <Text
                    fontSize="12px"
                    color={colorMode === "light" ? "black" : "dark.background"}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Box>
              <HStack spacing={2}>
                <BsMoon color={colorMode === "dark" ? "#2c3e50" : "gray.300"} />
                <Switch
                  colorScheme={colorMode === "light" ? "blue" : "red"}
                  size="md"
                  isChecked={colorMode === "light"}
                  onChange={toggleColorMode}
                />
                <BsSun color={colorMode === "light" ? "teal.300" : "#2c3e50"} />
              </HStack>
            </Box>
          </HStack>
          <VStack
            mt={4}
            borderRadius="md"
            height={"300px"}
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {messages.map((message) => (
              <Chat
                key={message.id}
                message={message.msg}
                mode={colorMode}
                user={message.isBot ? "bot" : "user"}
              />
            ))}
            <div ref={divRef}></div>
          </VStack>{" "}
          <form onSubmit={submitHandler}>
            <Box mt={4}>
              <InputGroup>
                <Input
                  placeholder="Talk to Nexty..."
                  color={colorMode === "light" ? "black" : "white"}
                  bg={customTheme.colors[colorMode].inputBg}
                  fontSize="14px"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <InputRightElement>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    backgroundColor={customTheme.colors[colorMode].sendButtonBg}
                    borderRadius={5}
                    p={2}
                    outline="none"
                    cursor="pointer"
                    aria-label="Send Message"
                    _placeholder={{
                      color: colorMode === "light" ? "gray.500" : "gray.200",
                    }}
                  >
                    <AiOutlineSend
                      color={customTheme.colors[colorMode].sendButtonColor}
                    />
                  </motion.button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </form>
        </MotionBox>
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default Chatbot;
