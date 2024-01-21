import React from "react";
import { Text, HStack } from "@chakra-ui/react";

const Chat = ({ mode, message, user = "bot" }) => {
  const getBackgroundColor = () => {
    if (mode === "dark") {
      return user === "bot" ? "skyblue" : "pink";
    } else {
      return user === "bot" ? "lightgray" : "skyblue";
    }
  };

  return (
    <HStack
      spacing={2}
      p={2}
      bg={getBackgroundColor()}
      w={"auto"}
      borderRadius={"base"}
      alignSelf={user === "bot" ? "flex-start" : "flex-end"}
    >
      <Text
        fontSize="14px"
        fontWeight={"600"}
        color={mode === "dark" ? "#2c3e50" : "black"}
      >
        {message}
      </Text>
    </HStack>
  );
};

export default Chat;
