import { Avatar } from "@chakra-ui/avatar";
import { Flex, HStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { ChatState } from "../context/ChatContext";

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
  }, [currentChat, socket, setTypingUserId, user._id]);

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
        flex="2"
        pos="relative"
        marginInlineStart="15px !important;"
      >
        <Text fontSize="lg">{name}</Text>
        {isTyping && (
          <Text
            pos="absolute"
            top="5"
            py="3px"
            fontSize="xs"
            color="green.500"
            fontWeight="bold"
          >
            typing...
          </Text>
        )}
      </Flex>
      <MdMoreVert size="1.5em" color="#7c7a7a" cursor="pointer" />
    </HStack>
  );
};

export default ChatBoxTopBar;
