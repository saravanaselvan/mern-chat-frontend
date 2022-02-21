import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import TopBar from "../components/TopBar";
import SearchBar from "../components/SearchBar";
import MyChats from "../components/MyChats";
import { Box, Flex } from "@chakra-ui/layout";
import EmptyChatBox from "../components/EmptyChatBox";
import { ChatState } from "../context/ChatContext";

import { useHistory } from "react-router-dom";
import ProfileDrawer from "../components/ProfileDrawer";
import ContactInfo from "../components/ContactInfo";

const ChatPage = () => {
  const { user, currentChat, setCurrentChat, showContactInfo } = ChatState();
  const history = useHistory();
  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      history.push("/");
    }
  }, [user]);

  const selectUser = (user) => {
    setCurrentChat({ users: [user] });
  };

  return (
    <Flex w="100%">
      <Flex direction="column" w="35%" h="100vh">
        <TopBar />
        <SearchBar />
        <MyChats
          h="90%"
          bg="white"
          selectChat={(chat) => setCurrentChat(chat)}
          selectUser={selectUser}
          selectedChat={currentChat}
        />
      </Flex>
      {currentChat ? <ChatBox /> : <EmptyChatBox />}
      {currentChat && showContactInfo && <ContactInfo chat={currentChat} />}
    </Flex>
  );
};

export default ChatPage;
