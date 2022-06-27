import { Avatar } from "@chakra-ui/avatar";
import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { Box, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useRef, useState } from "react";
import { GrUndo } from "react-icons/gr";
import { MdDone, MdPhotoCamera } from "react-icons/md";

const ProfilePic = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cameraLoading, setCameraLoading] = useState(false);
  const [picCaptured, setPicCaptured] = useState(false);
  const [picSrc, setPicSrc] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState("20%");
  const [y, setY] = useState("10%");
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const circleRef = useRef(null);
  const modalBodyRef = useRef(null);
  // const stripRef = useRef(null);
  let video;
  let localStream;

  const closeModal = () => {
    onClose();
    setPicCaptured(false);
    setTimeout(() => {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }, 100);
  };

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 280;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
  };

  const takePhoto = () => {
    let photo = photoRef.current;
    // let strip = stripRef.current;

    // console.warn(strip);

    const data = photo.toDataURL("image/jpeg");

    // console.warn(data);
    // const link = document.createElement("a");
    // link.href = data;
    // link.setAttribute("download", "myWebcam");
    // link.innerHTML = `<img src='${data}' width="100%" height="100%" alt='thumbnail'/>`;
    // strip.insertBefore(link, strip.firstChild);
    setPicCaptured(true);
    setPicSrc(data);
  };
  const accessCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1000, height: 1000 },
      });
      video = videoRef.current;
      localStream = stream;
      video.srcObject = stream;
      video.play();
    } catch (err) {
      console.error("error:", err);
    }
  };
  useEffect(() => {
    if (isOpen) accessCamera();
  }, [isOpen]);

  const updateCirclePosition = (e) => {
    if (!isDragging) return;
    let { left, top, right, bottom } =
      modalBodyRef.current.getBoundingClientRect();
    let x = e.clientX - left - circleRef.current.offsetWidth / 2;
    let y = e.clientY - top - circleRef.current.offsetHeight / 2;

    if (
      e.clientX > left + circleRef.current.offsetWidth / 2 &&
      e.clientX < right - circleRef.current.offsetWidth / 2
    )
      setX(`${x}px`);
    if (
      e.clientY > top + circleRef.current.offsetHeight / 2 &&
      e.clientY < bottom - circleRef.current.offsetHeight / 2
    )
      setY(`${y}px`);
  };
  return (
    <>
      <Avatar
        w="250px"
        h="250px"
        name={user?.name}
        src={user?.pic}
        cursor="pointer"
        alignSelf="center"
        onClick={onOpen}
        my={4}
      />
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader bg="teal.600" color="#fff" display="flex">
            <ModalCloseButton
              pos="relative"
              top={0}
              outline={0}
              _active={{ outline: "none" }}
              _focus={{ outline: "none" }}
            />
            <Text flex="1">Take Photo</Text>
            {picCaptured && (
              <Icon
                as={GrUndo}
                color="#fff"
                mr="4"
                fontSize="24"
                cursor="pointer"
                onClick={() => {
                  setPicCaptured(false);
                }}
              />
            )}
          </ModalHeader>
          <ModalBody
            ref={modalBodyRef}
            p={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            minWidth="300px"
            bg="gray.200"
          >
            {cameraLoading && (
              <Spinner
                width={10}
                height={10}
                thickness="4px"
                speed="0.65s"
                color="gray.400"
              />
            )}
            <>
              <video
                ref={videoRef}
                onCanPlay={() => {
                  paintToCanvas();
                  videoRef.current.style.width = "100%";
                  setCameraLoading(false);
                }}
                width={0}
                height={0}
                style={{ display: !picCaptured ? "block" : "none" }}
              />
              <canvas
                ref={photoRef}
                style={{
                  position: "absolute",
                  bottom: "-1000px",
                  display: !picCaptured ? "block" : "none",
                }}
              />
            </>
            <Box
              display={picCaptured ? "block" : "none"}
              w="100%"
              h="100%"
              background="black"
              pos="relative"
              onMouseMove={updateCirclePosition}
            >
              {/* <div ref={stripRef} style={{ width: "100%", height: "322px" }} /> */}
              <img
                src={picSrc}
                style={{ width: "100%", height: "322px", opacity: "50%" }}
              />
              <div
                ref={circleRef}
                style={{
                  position: "absolute",
                  width: "280px",
                  height: "280px",
                  borderRadius: "50%",
                  top: y,
                  left: x,
                  // border: "2px solid white",
                  overflow: "hidden",
                  cursor: "move",
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                }}
                onMouseUp={(e) => {
                  setIsDragging(false);
                }}
              >
                <div
                  style={{
                    background: "white",
                    width: "100%",
                    height: "100%",
                    mixBlendMode: "overlay",
                  }}
                ></div>
              </div>
            </Box>
          </ModalBody>

          <ModalFooter
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            minHeight="65px"
            bg="gray.200"
          >
            {!cameraLoading && !picCaptured && (
              <Icon
                w="60px"
                h="60px"
                p={4}
                borderRadius="50%"
                as={MdPhotoCamera}
                color="white"
                bg="teal"
                pos="absolute"
                top="-30px"
                cursor="pointer"
                onClick={() => takePhoto()}
              />
            )}
            {picCaptured && (
              <Icon
                w="60px"
                h="60px"
                p={4}
                borderRadius="50%"
                as={MdDone}
                color="white"
                bg="teal"
                pos="absolute"
                top="-30px"
                cursor="pointer"
                onClick={() => takePhoto()}
                right="25px"
              />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePic;
