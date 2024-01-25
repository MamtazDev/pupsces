import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgot-password/studentForgotPassword";
import NewStudentSignIn from "./NewStudent";
import { endPoint } from "../../../utils/config";

export default function StudentSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student_number, setStudnum] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleStudentNumberChange = (e) => {
    const value = e.target.value;
    console.log("Input value:", value);
    setStudnum(value);
  };

  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  const handleSignIn = async () => {
    if (!email || !password || !student_number) {
      setError("Please fill in all the fields");
      return;
    }

    try {
      const response = await fetch(
        `${endPoint}/students?studentNumber=${student_number}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const students = await response.json();

      if (
        students.student_number === student_number &&
        students.email === email &&
        students.student_password === password
      ) {
        setUser({
          username: students.username,
          roles: students.roles,
          student_number: students.student_number,
        });

        // Log the data before setting cookies
        console.log("Program ID:", students.program_id);
        console.log("Strand:", students.strand);

        // Set cookies after the user is set
        Cookies.set("student_number", students.student_number, { expires: 10 });
        Cookies.set("program_id", students.program_id, { expires: 10 });
        Cookies.set("strand", students.strand, { expires: 10 });

        // Navigate after setting cookies
        navigate("/studentdashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const [showNewSignIn, setShowNewSignIn] = useState(false);

  const handleNewSignInClick = () => {
    setShowNewSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowNewSignIn(false);
  };

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      mr="1rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showNewSignIn && !showForgotPassword && (
        <Box paddingTop="6rem" w="29rem">
          <VStack align="flex-start">
            <Text fontSize="2rem" color="white" mb="1rem">
              Sign In
            </Text>

            <AnimatePresence>
              {error ? (
                <Center
                  bg="#FAECD6"
                  w="65.5%"
                  p=".8rem"
                  borderRadius=".3rem"
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2 },
                  }}
                  exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
                  color="palette.primary"
                  fontWeight="inter"
                  fontSize=".9rem"
                  fontFamily="inter"
                  textAlign="center"
                >
                  {error}
                </Center>
              ) : null}
            </AnimatePresence>

            <Divider w="20.5rem" mb="1rem" />
            {/* Student Number */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Student Number"
              color="palette.primary"
              w="21rem"
              value={student_number}
              onChange={handleStudentNumberChange}
            />
            {/* Email */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Email"
              color="palette.primary"
              w="21rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Password */}
            <InputGroup size="md">
              <Input
                bg="palette.secondary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                color="palette.primary"
                w="21rem"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem" mr="8rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  _hover={{ background: "none", border: "none" }}
                  _focus={{ background: "none", border: "none" }}
                  _active={{ background: "none", border: "none" }}
                  style={buttonStyles}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye color="palette.primary" />
                  ) : (
                    <FaEyeSlash color="palette.primary" />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Text
              ml="13.7rem"
              fontSize="14px"
              color="gray"
              fontWeight="bold"
              align="flex-end"
              mt="1rem"
              mb="1rem"
              onClick={handleForgotPasswordClick}
              cursor={"pointer"}
            >
              Forgot Password?
            </Text>

            <Button
              onClick={() => handleSignIn()}
              size="md"
              height="40px"
              width="21rem"
              border="2px"
              bg="#FAECD6"
              borderColor="#FFF5E0"
            >
              Log In
            </Button>

            <HStack mt="2rem">
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Link to="/terms">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Terms
                </Text>
              </Link>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Link to="/policy">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Privacy Policy
                </Text>
              </Link>
            </HStack>

            <HStack ml="4rem" mt="2rem">
              <Text fontSize="xs" color="gray.400">
                Are you a new user?
              </Text>
              <Text
                fontSize="xs"
                color="#F0F0F0"
                cursor="pointer"
                onClick={handleNewSignInClick}
              >
                {" "}
                Click here to login
              </Text>
            </HStack>

            <Text mt="8rem" ml="3rem" fontSize="xs" color="gray">
              Copyright 2023 Visionalyze || All rights reserved.
            </Text>
          </VStack>
        </Box>
      )}

      {showNewSignIn && (
        <NewStudentSignIn onCancel={() => setShowNewSignIn(false)} />
      )}
    </Flex>
  );
}
