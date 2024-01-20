import React, { useEffect, useState } from "react";
import { app } from "./firebase";
import Chat from "./components/Chat";
import {
  VStack,
  HStack,
  Box,
  Container,
  Button,
  Input,
} from "@chakra-ui/react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const google_provider = new GoogleAuthProvider();
  signInWithPopup(auth, google_provider);
};

const logoutHander = () => signOut(auth);

function App() {
  const [user, setUser] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const submitHander = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, "Chats"), {
        text: chatMessage,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const removedState = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    return () => {
      removedState();
    };
  }, []);
  return (
    <Box bg={"black"}>
      {user ? (
        <Container bg={"whitesmoke"} h={"100vh"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button w={"full"} colorScheme={"blue"} onClick={logoutHander}>
              Logout
            </Button>
            <VStack h={"full"} w={"full"} overflowY={"auto"}>
              <Chat user={"admin"} message="Hi" />
            </VStack>
            <form onSubmit={submitHander} style={{ width: "100%" }}>
              <HStack>
                <Input
                  onChange={(event) => {
                    setChatMessage(event.target.value);
                  }}
                  value={chatMessage}
                  placeholder="Type your message here.."
                />
                <Button type="submit" colorScheme={"red"}>
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack justifyContent={"center"} alignItems={"center"} h={"100vh"}>
          <Button colorScheme="red" onClick={loginHandler}>
            Sign-in with Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
