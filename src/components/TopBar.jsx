import {
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { MdMessage, MdMoreVert } from "react-icons/md";
import { ChatState } from "../context/ChatContext";
import MdStatusIcon from "../lib/MdStatusIcon";
import ProfileDrawer from "./ProfileDrawer";

const TopBar = () => {
  const { user, setUser, setCurrentChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logOut = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setCurrentChat(null);
  };
  return (
    <HStack px="4" py="3" bg="gray.100" spacing="30px">
      <>
        <Avatar
          w="40px"
          h="40px"
          name={user?.name}
          src={user?.pic}
          cursor="pointer"
          onClick={onOpen}
        />
        <ProfileDrawer isOpen={isOpen} onClose={onClose} />
      </>
      <Spacer />
      <MdStatusIcon />
      <MdMessage size="1.5em" color="#7c7a7a" cursor="pointer" />
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          aria-label="options"
          _active={{ outline: "none" }}
          _focus={{ outline: "none" }}
          borderRadius={25}
          icon={<MdMoreVert />}
        />
        <MenuList>
          <MenuItem onClick={logOut}>Log out</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default TopBar;
