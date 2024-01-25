import {
  Box,
  Button,
  Flex,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { useState } from "react";
import Logo from "../../../../assets/PUPlogo.png";


const customButtonStyles = css`
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  &:hover {
    color: #23331d;
    background-color: #e5f4e2;
    box-shadow: 0 0 0 2px #e5f4e2;
    transition: all 0.3s ease;
  }
`;

export default function HomeButtons({ onFacultyClick, onStudentClick }) {
  const [showFacultySignIn, setShowFacultySignIn] = useState(false);
  const [showStudentSignIn, setShowStudentSignIn] = useState(false);

  const showSignInComponent = (type) => {
    console.log("Setting sign-in type:", type);
    if (type === "faculty") {
      setShowFacultySignIn(true);
      setShowStudentSignIn(false);
    } else if (type === "student") {
      setShowStudentSignIn(true);
      setShowFacultySignIn(false);
    }
    console.log("showFacultySignIn:", showFacultySignIn);
    console.log("showStudentSignIn:", showStudentSignIn);
  };

  return (
    <>
      <VStack gap={10}>
        <Box
         
          w="5rem"
          pos="absolute"
          top="7rem"
          left="69rem"
          zIndex={1}
        >
          <Image src={Logo} alt="Logo" />
        </Box>
        <Box
          
          paddingTop="10rem"
          w="30rem"
          color="#E5F4E2"
          mr="7rem"
        >
          <Text
           
            fontSize={26}
            textAlign="center"
            fontWeight="medium"
          >
          PUP Student Curriculum Evaluation System
          </Text>
        </Box>
        <Box  mr="7rem">
          <Text color="#E5F4E2">
            Tap or Click your Destination
          </Text>
        </Box>
      </VStack>
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Stack
          direction="column"
          spacing={10}
          align="flex-start"
          marginRight="8rem"
          mb="35rem"
        >
          <Button
           
            onClick={() => {
              setShowFacultySignIn(true);
              onFacultyClick();
              showSignInComponent("faculty");
            }}
            css={customButtonStyles}
            bg="#E5F4E2"
            w="20rem"
          >
            Faculty
          </Button>

          <Button
           
            onClick={() => {
              setShowStudentSignIn(true);
              onStudentClick();
              showSignInComponent("student");
            }}
            css={customButtonStyles}
            variant="outline"
            color="#E5F4E2"
            w="20rem"
          >
            Student
          </Button>
        </Stack>
      </Flex>
    </>
  );
}

HomeButtons.propTypes = {
  onStudentClick: PropTypes.func.isRequired,
  onFacultyClick: PropTypes.func.isRequired,
};
