import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import "./home.css";

import PUP from "../../assets/IBITS.png";
import Square from "../../components/shapes/square";
import Triangle from "../../components/shapes/triangle";
import FacultySignIn from "../faculty/components/facultySignin";
import StudentSignIn from "../student/components/studentSignin";
import HomeButtons from "./components/buttons/buttons";

export const Home = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [showFacultySignIn, setShowFacultySignIn] = useState(false);
  const [showStudentSignIn, setShowStudentSignIn] = useState(false);

  // function to change the shape
  const toggleShapeAndSignIn = (type) => {
    setShowSquare((prevShowSquare) => !prevShowSquare);
    setShowFacultySignIn(type === "faculty");
    setShowStudentSignIn(type === "student");
  };
  //  const showFacultySignInComponent = () => {
  //    setShowFacultySignIn(true);
  //    setShowStudentSignIn(false);
  //  };

  //  const showStudentSignInComponent = () => {
  //    setShowStudentSignIn(true);
  //    setShowFacultySignIn(false);
  //  };

  const width = useBreakpointValue({ base: "100%", lg: "55.5%" });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex
      h="100vh"
      w="100%"
      justifyContent="center"
      overflow="hidden"
      position="absolute"
    >
      <Box
        className="image"
        w={showFacultySignIn || showStudentSignIn ? width : "55.5%"}
        h="100%"
        pos="absolute"
        bgImage={`url(${PUP})`}
        bgRepeat="no-repeat"
        bgPos="center"
        bgSize="cover"
        left="0"
        bottom="0"
        border="white"
        zIndex={-1}
        opacity={0.6}
      />

      <Box
        zIndex="3"
        pos="absolute"
        right={isDesktop ? "3rem" : undefined}
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxW="30rem" // Set the desired maximum width
        width="100%" // Stretch the width to 100%
      >
        {showFacultySignIn ? (
          <FacultySignIn />
        ) : showStudentSignIn ? (
          <StudentSignIn />
        ) : (
          <HomeButtons
            onFacultyClick={() => toggleShapeAndSignIn("faculty")}
            onStudentClick={() => toggleShapeAndSignIn("student")}
          />
        )}
      </Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        width={0}
        height={0}
        transition="background-color 0.1s ease"
      >
        {showSquare ? <Square /> : <Triangle />}
      </Box>
    </Flex>
  );
};
