import React, { useState, useRef, useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
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
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { sendMessageToOpenAI } from "../openai";
import offline from "../assets/offline.wav";
import online from "../assets/online.wav";
import deleteSound from "../assets/deleteSound.wav";
import messageSound from "../assets/messageSound.mp3";

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
      deleteButtonColor: "black",
    },
    dark: {
      primary: "#2980b9",
      secondary: "#27ae60",
      background: "#2c3e50",
      text: "#ecf0f1",
      inputBg: "#2c3e50",
      sendButtonBg: "green.600",
      sendButtonColor: "white",
      deleteButtonColor: "lightpink",
    },
  },
});

const MotionBox = motion(Box);

const Chatbot = () => {
  const db = getFirestore(app);
  const messagesCollection = collection(db, "Messages");
  const querySnapshot = query(messagesCollection, orderBy("createdAt", "asc"));
  const divRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isOnline, setisOnline] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsTyping(true);

      if (!isOnline && message.toLowerCase() !== "bye") {
        const onlineSound = new Audio(online);
        await onlineSound.play();
        setisOnline(true);
      }
      setMessage("");

      await addDoc(messagesCollection, {
        msg: message,
        createdAt: serverTimestamp(),
        isBot: false,
      });
      const res = await sendMessageToOpenAI(message);

      await addDoc(messagesCollection, {
        msg: res.message["content"],
        createdAt: serverTimestamp(),
        isBot: true,
      });

      setIsTyping(false);
      if (message.toLowerCase() !== "bye") {
        const messageSoundBot = new Audio(messageSound);
        await messageSoundBot.play();
      }

      if (message.toLowerCase() === "bye") {
        const offlineSound = new Audio(offline);
        await offlineSound.play();
        setisOnline(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  const deleteButtonHandler = async () => {
    const messagesRef = collection(db, "Messages");
    const querySnapshot = await getDocs(messagesRef);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      batch.delete(docRef);
    });

    const deleteSnd = new Audio(deleteSound);
    deleteSnd.play();
    await batch.commit();
  };

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages);
        divRef.current.scrollIntoView({ behavior: "smooth" });
      });

      return () => unsubscribe();
    } catch (error) {
      alert(error);
    }
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
            borderRadius={"md"}
            height={"300px"}
            overflowY={"auto"}
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
            {isTyping && (
              <Text fontSize={"14px"} alignSelf={"flex-start"}>
                Nexty is typing...
              </Text>
            )}
            <div ref={divRef}></div>
          </VStack>{" "}
          <HStack mt={4} spacing={2}>
            <form onSubmit={submitHandler}>
              <InputGroup>
                <Input
                  placeholder="Talk to Nexty..."
                  color={colorMode === "light" ? "black" : "white"}
                  bg={customTheme.colors[colorMode].inputBg}
                  fontSize="14px"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  w={"242px"}
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
                    j
                  >
                    <AiOutlineSend
                      color={customTheme.colors[colorMode].sendButtonColor}
                    />
                  </motion.button>
                </InputRightElement>
              </InputGroup>
            </form>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={deleteButtonHandler}
              backgroundColor={customTheme.colors[colorMode].sendButtonBg}
              borderRadius={5}
              p={2}
              outline="none"
              cursor="pointer"
              aria-label="Delete All Messages"
            >
              <FaTrash
                color={customTheme.colors[colorMode].deleteButtonColor}
              />
            </motion.button>
          </HStack>
        </MotionBox>
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default Chatbot;
