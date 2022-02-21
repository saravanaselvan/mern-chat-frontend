import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import axios from "axios";
import { useRef, useState } from "react";
import { ChatState } from "../context/ChatContext";

const SearchBar = () => {
  const [isSearchIconVisible, setIsSearchIconVisible] = useState(true);
  const searchInputRef = useRef(null);
  const searchIconRef = useRef(null);
  const { user, setSearchResults, searchQuery, setSearchQuery } = ChatState();

  const searchUsers = async (e) => {
    setSearchQuery(e.target.value);

    const { data } = await axios.get("/api/user", {
      params: {
        search: searchQuery,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    setSearchResults(data);
  };
  return (
    <Box bg="white">
      <InputGroup>
        <InputLeftElement
          onClick={() => {
            if (isSearchIconVisible) {
              searchInputRef.current.focus();
            } else {
              setSearchQuery("");
              searchIconRef.current.focus();
            }
          }}
          ref={searchIconRef}
          children={
            <>
              <SearchIcon
                color="#7c7a7a"
                ml="4"
                fontSize="15"
                cursor="pointer"
                onClick={() => {
                  setIsSearchIconVisible(!isSearchIconVisible);
                }}
                className={
                  isSearchIconVisible
                    ? "seach_icon--visible"
                    : "seach_icon--invisible"
                }
              />
              <ArrowBackIcon
                color="green.500"
                ml="4"
                fontSize="24"
                cursor="pointer"
                onClick={() => {
                  setIsSearchIconVisible(!isSearchIconVisible);
                }}
                className={
                  isSearchIconVisible
                    ? "back_icon--invisible"
                    : "back_icon--visible"
                }
              />
            </>
          }
        />
        <Input
          variant="filled"
          mx="2"
          my="1"
          w="95%"
          pl="16"
          fontSize="14"
          h="8"
          placeholder="Search or start new chat"
          focusBorderColor="none"
          _focus={{ backgroundColor: "none" }}
          ref={searchInputRef}
          value={searchQuery}
          onChange={searchUsers}
          onFocus={(e) => {
            setIsSearchIconVisible(false);
          }}
          onBlur={(e) => {
            if (!searchQuery) setIsSearchIconVisible(true);
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
