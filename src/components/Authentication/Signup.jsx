import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../context/ChatContext";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [hidePassword, setHidepassword] = useState(true);
  const [hideConfirmpassword, setHideConfirmpassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const toastIdRef = useRef();
  const history = useHistory();
  const { setUser } = ChatState();
  const postDetails = (pic) => {};

  const submitHandler = async (e) => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      if (toastIdRef.current) toast.close(toastIdRef.current);
      toastIdRef.current = toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      if (toastIdRef.current) toast.close(toastIdRef.current);
      toastIdRef.current = toast({
        title: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <form onSubmit={submitHandler} style={{ width: "100%" }}>
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={hidePassword ? "password" : "text"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setHidepassword(!hidePassword)}
              >
                {hidePassword ? "Show" : "Hide"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={hideConfirmpassword ? "password" : "text"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setHideConfirmpassword(!hideConfirmpassword)}
              >
                {hideConfirmpassword ? "Show" : "Hide"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          ></Input>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </form>
    </VStack>
  );
};

export default Signup;
