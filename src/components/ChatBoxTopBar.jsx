import { Avatar } from "@chakra-ui/avatar";
import { Flex, HStack, Spacer } from "@chakra-ui/layout";
import { MdMoreVert } from "react-icons/md";
import { Text } from "@chakra-ui/react";
import { ChatState } from "../context/ChatContext";
import { useEffect, useState } from "react";

const ChatBoxTopBar = () => {
  const { user, socket, currentChat, setTypingUserId, setShowContactInfo } =
    ChatState();
  const [isTyping, setIsTyping] = useState(false);
  let name;
  let pic;
  if (currentChat.isGroupChat) {
    name = currentChat.chatName;
    pic = "";
  } else {
    let otherUser = currentChat.users.filter((u) => u._id !== user._id)[0];
    name = otherUser.name;
    pic = otherUser.pic;
  }

  useEffect(() => {
    const typingHandler = (message) => {
      let otherUser = currentChat.users.filter((u) => u._id !== user._id)[0];
      if (otherUser._id === message.user._id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      } else {
        setTypingUserId(message.user._id);
      }
    };
    socket.on("typing", typingHandler);
    return () => {
      socket.off("typing", typingHandler);
    };
  }, [currentChat]);

  return (
    <HStack px="4" py="3" bg="gray.100" spacing="30px" zIndex="100">
      <Avatar
        w="40px"
        h="40px"
        name={name}
        src={pic}
        cursor="pointer"
        onClick={() => setShowContactInfo(true)}
      />
      <Flex
        direction="column"
        cursor="pointer"
        onClick={() => setShowContactInfo(true)}
      >
        <Text fontSize="lg">{name}</Text>
        {isTyping ? <Text fontSize="xs">typing...</Text> : <>&nbsp;</>}
      </Flex>
      <Spacer />
      <MdMoreVert size="1.5em" color="#7c7a7a" cursor="pointer" />
    </HStack>
  );
};

export default ChatBoxTopBar;
