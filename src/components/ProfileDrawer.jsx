import { Avatar } from "@chakra-ui/avatar";
import { ArrowBackIcon, CheckIcon, Icon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@chakra-ui/modal";
import {
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { ChatState } from "../context/ChatContext";

const ProfileDrawer = ({ isOpen, onClose, placement = "left" }) => {
  const [editName, setEditName] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const { user, setUser } = ChatState();
  const [newName, setNewName] = useState(user?.name);
  const [newAbout, setNewAbout] = useState(user?.about);
  useEffect(() => {
    setNewName(user?.name);
    setNewAbout(user?.about);
  }, [user]);
  const toast = useToast();
  const updateUserName = async () => {
    if (!newName) {
      toast({
        title: "Username cannot be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      return;
    }
    setEditName(false);
    setEditAbout(false);
    try {
      await axios.put(
        "/api/user/updateDetails",
        { userId: user._id, newName, newAbout },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const currentUser = JSON.parse(localStorage.getItem("userInfo"));
      currentUser.name = newName;
      currentUser.about = newAbout;
      setUser(currentUser);
      localStorage.setItem("userInfo", JSON.stringify(currentUser));
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
  return (
    <Drawer
      size="sm"
      placement={placement}
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick="false"
    >
      {/* <DrawerOverlay /> */}
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" bg="teal.600" color="#fff">
          <ArrowBackIcon
            color="#fff"
            mr="4"
            fontSize="24"
            cursor="pointer"
            onClick={() => {
              setEditName(false);
              setEditAbout(false);
              onClose();
            }}
          />
          Profile
        </DrawerHeader>
        <DrawerBody bg="gray.200" pl={0} pr={0}>
          <Flex direction="column" gap={4}>
            <Avatar
              w="250px"
              h="250px"
              name={user?.name}
              src={user?.pic}
              cursor="pointer"
              alignSelf="center"
            />
            <Flex
              direction="column"
              bg="#fff"
              gap={4}
              px={8}
              py={4}
              boxShadow="sm"
            >
              <Text fontSize="sm" color="teal.600">
                Your name
              </Text>
              <Flex justifyContent="space-between" h="35px">
                {editName ? (
                  <InputGroup>
                    <Input
                      value={newName}
                      variant="flushed"
                      h="35px"
                      borderColor="teal.600"
                      focusBorderColor="teal.600"
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <InputRightElement
                      children={
                        <CheckIcon
                          color="gray.400"
                          onClick={updateUserName}
                          cursor="pointer"
                        />
                      }
                    />
                  </InputGroup>
                ) : (
                  <>
                    <Text>{newName}</Text>
                    <Icon
                      as={MdModeEdit}
                      fontSize="1.25em"
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => setEditName(true)}
                    />
                  </>
                )}
              </Flex>
            </Flex>
            <Text px={8} py={4} fontSize="sm" color="gray.600">
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </Text>
            <Flex
              direction="column"
              bg="#fff"
              gap={4}
              px={8}
              py={4}
              boxShadow="sm"
            >
              <Text fontSize="sm" color="teal.600">
                About
              </Text>
              <Flex justifyContent="space-between">
                {editAbout ? (
                  <InputGroup>
                    <Input
                      value={newAbout}
                      variant="flushed"
                      h="35px"
                      borderColor="teal.600"
                      focusBorderColor="teal.600"
                      onChange={(e) => setNewAbout(e.target.value)}
                    />
                    <InputRightElement
                      children={
                        <CheckIcon
                          color="gray.400"
                          onClick={updateUserName}
                          cursor="pointer"
                        />
                      }
                    />
                  </InputGroup>
                ) : (
                  <>
                    <Text>{newAbout}</Text>
                    <Icon
                      as={MdModeEdit}
                      fontSize="1.25em"
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => setEditAbout(true)}
                    />
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;
