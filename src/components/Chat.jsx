import React from "react";
import { Avatar, HStack, Text } from "@chakra-ui/react";

const Chat = ({ message, uri, user }) => {
  return (
    <HStack
      padding={"2"}
      bg={"purple.100"}
      borderRadius={"5"}
      alignSelf={user !== "admin" ? "flex-end" : "flex-start"}
    >
      {user === "admin" && <Avatar src={uri} size={"sm"} />}
      <Text>{message}</Text>
      {user !== "admin" && <Avatar src={uri} size={"sm"} />}
    </HStack>
  );
};

export default Chat;
