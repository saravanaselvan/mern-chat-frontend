import { Box, Flex } from "@chakra-ui/layout";
import { Spinner, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatContext";
import ChatBoxBottomBar from "./ChatBoxBottomBar";
import ChatBoxTopBar from "./ChatBoxTopBar";

const ChatBox = () => {
  const { user, socket, chats, setChats, currentChat, setCurrentChat } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/api/message", {
          params: {
            chatId: currentChat._id,
          },

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessages(data);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    if (currentChat._id) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [currentChat, user, toast]);

  const updateMessages = (message) => {
    console.log(currentChat);
    if (currentChat._id === message.chat._id) {
      setMessages([message, ...messages]);
    }

    if (!currentChat._id) {
      const newChat = { ...message.chat, latestMessage: message };
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
    }
  };

  useEffect(() => {
    const newMessageHandler = ({ user, message }) => {
      if (!currentChat._id) {
        setCurrentChat(message.chat);
      }
      updateMessages(message);
    };
    socket.on("new message", newMessageHandler);
    return () => {
      socket.off("new message", newMessageHandler);
    };
  });

  return (
    <Flex
      w="70%"
      bg="gray.50"
      h="100vh"
      flexDirection="column"
      pos="relative"
      bgColor="#efeae2"
    >
      <Box
        backgroundImage="/images/bg-chat-tile-dark.png"
        sx={{
          position: "absolute;",
          width: "100%;",
          height: "100%;",
          top: "0;",
          left: "0;",
          opacity: "0.4",
        }}
      />
      <ChatBoxTopBar />
      <Flex
        direction={isLoading ? "column" : "column-reverse"}
        pos="absolute"
        bottom="0"
        w="100%"
        mb="64px"
        pl="40px"
        pr="30px"
        h={isLoading ? "50%" : "80%"}
        overflowY="auto"
      >
        {isLoading && (
          <Flex
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
            w="60px"
            h="60px"
            bg="#fff"
            justifySelf="center"
            borderRadius="50%"
          >
            <Spinner
              thickness="4px"
              speed="1s"
              emptyColor="gray.200"
              color="green.700"
              size="xl"
              bg="#fff"
            />
          </Flex>
        )}
        {!isLoading &&
          messages.map((message) => {
            const style =
              message.sender._id === user._id
                ? {
                    backgroundColor: "green.100",
                    alignSelf: "flex-end",
                    marginRight: "50px",
                    borderTopRightRadius: "0px",
                  }
                : {
                    backgroundColor: "#fff",
                    alignSelf: "flex-start",
                    marginLeft: "50px",
                    borderTopLeftRadius: "0px",
                  };
            let arrowStyle = {
              position: "absolute",
              top: "0px",
              width: "0px",
              height: "0px",
              border: "10px solid transparent",
            };
            if (message.sender._id === user._id) {
              arrowStyle = {
                ...arrowStyle,
                borderTop: "10px solid #C6F6D5",
                right: "-10px",
              };
            } else {
              arrowStyle = {
                ...arrowStyle,
                borderTop: "10px solid #fff",
                left: "-10px",
              };
            }
            const sentAt = new Date(message.createdAt).toLocaleTimeString(
              "en-GB"
            );

            let sentAtString = sentAt.split(":").slice(0, 2).join(":");
            return (
              <Flex
                direction="column"
                key={message._id}
                sx={style}
                p={2}
                borderRadius={6}
                pos="relative"
                minW={100}
                gap={1}
                mt={2}
                mb={2}
                boxShadow="base"
                maxW="90%"
              >
                <Box sx={arrowStyle}></Box>
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {message.content}
                </Text>
                <Text fontSize={11} m={-1} mb={-2} alignSelf="flex-end">
                  {sentAtString}
                </Text>
              </Flex>
            );
          })}
      </Flex>
      <ChatBoxBottomBar updateMessages={updateMessages} />
    </Flex>
  );
};

export default ChatBox;
