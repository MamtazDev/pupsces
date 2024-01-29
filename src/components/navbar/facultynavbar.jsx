import {
  Box,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { Link as RouterLink, NavLink } from "react-router-dom";
import "../../components/navbar/navbar.css";
import { handleScroll } from "./handleNavbar";
import logo from "../../assets/PUPlogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import {endPoint} from "../../pages/config"

function FacultyNavbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");
  

   useEffect(() => {
     if (facultyEmail) {
       axios
         .get(
           `${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`
         )
         .then((response) => {
           const facultyData = response.data;
           setFacultyName(
             `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
           );
         
         })
         .catch((error) => {
           console.error(error);
         });
     }
   }, [facultyEmail]);
  const scrollCallback = () => {
    if (window.scrollY > 100) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  };

  useEffect(() => {
    const cleanupScrollHandler = handleScroll(scrollCallback);

    return () => {
      cleanupScrollHandler();
    };
  }, []);

  const navbarClasses = `navbar ${showNavbar ? "" : "fade-out"}`;

  // const activeLinkStyle = {
  //   borderBottom: "2px solid #000", // You can adjust the style here
  //   paddingBottom: "3px", // Optional: Add some spacing between the text and the line
  // };

  return (
    <Box
      w="100%"
      pos="fixed"
      h="6rem"
      boxShadow="none"
      top="0"
      right="0"
      className={navbarClasses}
    >
      <Flex
        padding="0 14.2rem"
        justifyContent="space-between"
        alignItems="center"
        h="100%"
      >
        <HStack>
          <Image w="45px" src={logo} />
          <Text
            fontSize="18px"
            fontWeight="medium"
            display="flex"
            justifyContent="center"
          >
            PUPCES
          </Text>
        </HStack>
        <Flex gap={34} mr="30rem">
          <NavLink
            to="/facultyHome"
            activeclassname="active"
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/facultydashboard"
            activeclassname="active"
            className="nav-link"
          >
            Curriculum
          </NavLink>

          <NavLink
            to="/facultyevaluation"
            activeclassname="active"
            className="nav-link"
          >
            Evaluation
          </NavLink>
        </Flex>

        <ChakraLink
          as={RouterLink}
          to="/facultyuserProfile"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <InitialsAvatar name={facultyName} className="avatar-circle" />
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default FacultyNavbar;
