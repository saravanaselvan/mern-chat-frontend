import { Avatar } from "@chakra-ui/avatar";
import { AttachmentIcon, Icon } from "@chakra-ui/icons";
import { HStack } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdEmojiEmotions, MdMic, MdSend } from "react-icons/md";
import { ChatState } from "../context/ChatContext";

const ChatBoxBottomBar = ({ updateMessages }) => {
  const [content, setContent] = useState();
  const { user, socket, currentChat, setSearchQuery } = ChatState();
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current.style.height = "40px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [content]);

  useEffect(() => {
    textareaRef.current.focus();
  }, [currentChat]);
  const updateContent = (e) => {
    if (e.key !== "Enter") {
      setContent(e.target.value);
      socket.emit("typing", { user, content: e.target.value });
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && content.trim().length && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const text = content;
    setContent("");
    const {
      data: { message, notification },
    } = await axios.post(
      "/api/message",
      {
        chatId: currentChat._id,
        userId: !currentChat._id ? currentChat.users[0]._id : null,
        content: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    updateMessages(message);
    setSearchQuery("");
    socket.emit("send message", { user, message, notification });
  };
  return (
    <HStack
      px="4"
      py="3"
      bg="gray.100"
      spacing="30px"
      pos="fixed"
      bottom="0"
      w="67%"
    >
      <MdEmojiEmotions size="2em" color="#7c7a7a" cursor="pointer" />
      <AttachmentIcon h={6} w={6} color="gray.600" cursor="pointer" />
      <Textarea
        ref={textareaRef}
        resize="none"
        minHeight="40px"
        focusBorderColor="none"
        _focus={{ backgroundColor: "none" }}
        bg="white"
        value={content}
        onChange={updateContent}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />
      {content ? (
        <Icon
          as={MdSend}
          h={8}
          w={8}
          color="gray.600"
          cursor="pointer"
          sx={{
            marginInlineStart: "10px !important;",
            marginInlineEnd: "10px !important;",
          }}
          onClick={sendMessage}
        />
      ) : (
        <Icon
          as={MdMic}
          h={8}
          w={8}
          color="gray.600"
          cursor="pointer"
          sx={{
            marginInlineStart: "10px !important;",
            marginInlineEnd: "10px !important;",
          }}
        />
      )}
    </HStack>
  );
};

export default ChatBoxBottomBar;
