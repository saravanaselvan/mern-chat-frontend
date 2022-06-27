import { Avatar } from "@chakra-ui/avatar";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, HStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { ChatState } from "../context/ChatContext";

const ChatBoxTopBar = () => {
  const {
    user,
    socket,
    currentChat,
    setCurrentChat,
    setTypingUserId,
    setShowContactInfo,
    chats,
  } = ChatState();
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

  const typingHandler = ({ typingUser, currentChatId }) => {
    if (!chats.find((chat) => chat._id === currentChatId)) return;
    let otherUser = currentChat.users.filter(
      (u) => u._id !== typingUser._id
    )[0];
    if (otherUser._id === user._id) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    } else {
      setTypingUserId(typingUser._id);
    }
  };
  useEffect(() => {
    socket.on("typing", typingHandler);
    return () => {
      socket.off("typing", typingHandler);
    };
  }, [currentChat, socket, setTypingUserId, user._id]);

  return (
    <HStack px="4" py="3" bg="gray.100" spacing="30px" zIndex="100">
      <ArrowBackIcon
        d={{ base: "flex", md: "none" }}
        fontSize="24"
        cursor="pointer"
        onClick={() => {
          setCurrentChat("");
        }}
        mr={2}
      />
      <Avatar
        w="40px"
        h="40px"
        name={name}
        src={pic}
        cursor="pointer"
        marginInlineStart="0px !important"
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
