import { Box, List, ListItem } from "@chakra-ui/layout";
import { Divider, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ChatInfo from "./ChatInfo";
import axios from "axios";
import { ChatState } from "../context/ChatContext";
import { useHistory } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";

const MyChats = ({ selectChat, selectUser }) => {
  const {
    user,
    setUser,
    searchQuery,
    setSearchQuery,
    searchResults,
    chats,
    setChats,
    currentChat,
    socket,
  } = ChatState();
  const toast = useToast();
  const history = useHistory();
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("/api/chat", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        if (error.response.status === 401) {
          localStorage.removeItem("userInfo");
          setUser(null);
          history.push("/");
        }
      }
    };

    if (user) fetchChats();
  }, [user, history]);

  const newMessageHandler = ({ user, message, notification }) => {
    const availableChat = chats.filter((item) => item._id === message.chat._id);
    if (availableChat.length) {
      setChats(
        chats.filter((item) => {
          if (message.chat._id === item._id) {
            item.latestMessage = message;
            item.notification = notification;
          }
          return true;
        })
      );
      currentChat && clearCurrentChatNotification();
    } else {
      const newChat = { ...message.chat, latestMessage: message, notification };
      setChats([newChat, ...chats]);
    }
  };

  const clearCurrentChatNotification = async () => {
    // setTimeout(() => {
    setChats(
      chats.filter((item) => {
        if (currentChat._id === item._id) {
          item.notification = null;
        }
        return true;
      })
    );

    await axios.put(
      "api/notification/clear",
      {
        chatId: currentChat._id,
        userId: user._id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    // }, 2000);
  };

  const selectUserFromSearch = (user) => {
    const availableChat = chats.find((chat) =>
      chat.users.map((u) => u._id).includes(user._id)
    );
    if (availableChat) {
      selectChat(availableChat);
    } else {
      selectUser(user);
      setSearchQuery("");
    }
  };
  useEffect(() => {
    socket?.emit("setup", user._id);
    socket?.on("new message", newMessageHandler);
    return () => {
      socket?.off("new message", newMessageHandler);
    };
  }, [socket, chats]);

  useEffect(() => {
    currentChat && clearCurrentChatNotification();
  }, [currentChat]);
  return (
    <Box h="100%" bg="white">
      <Divider />
      <List>
        {searchQuery
          ? searchResults.map((item) => (
              <ListItem
                key={item._id}
                px="2"
                pt="4"
                cursor="pointer"
                _hover={{ background: "#EDF2F7" }}
                onClick={() => selectUserFromSearch(item)}
              >
                <SearchResultItem user={item} />
              </ListItem>
            ))
          : chats.map((chat) => (
              <ListItem
                key={chat._id}
                px="2"
                pt="4"
                cursor="pointer"
                _hover={{ background: "#EDF2F7" }}
                onClick={() => selectChat(chat)}
                bg={currentChat?._id === chat._id ? "#EDF2F7" : ""}
              >
                {user && <ChatInfo chat={chat} />}
              </ListItem>
            ))}
      </List>
    </Box>
  );
};

export default MyChats;
