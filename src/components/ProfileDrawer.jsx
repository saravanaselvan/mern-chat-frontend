import { Avatar } from "@chakra-ui/avatar";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@chakra-ui/modal";
import { Text } from "@chakra-ui/react";

const ProfileDrawer = ({ isOpen, onClose, user }) => {
  return (
    <Drawer
      size="sm"
      placement="left"
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
              <Text>{user?.name}</Text>
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
              <Text>{user?.about}</Text>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;
