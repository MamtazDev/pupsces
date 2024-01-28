import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  VStack,
  useToast,
  Center,
  Divider,
} from "@chakra-ui/react";

import { doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, db } from "../../../app-service/firebase-config";
import { AnimatePresence, motion } from "framer-motion";
import StudentSignIn from "./studentSignin";

export default function StudentSignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [gender, setGender] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");
  const [student_number, setStudnum] = useState("");
  const type = "Student";
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  //to validate email if it has @
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const toast = useToast();

  //styling the eye for password
  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  const [showPassword, setShowPassword] = useState(false);

  const [showSignIn, setShowSignIn] = useState(false);

  //to show the signIn when click
  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;

    const errors = [];

    if (password.length < minLength) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (!uppercaseRegex.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
    }

    if (!lowercaseRegex.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
    }

    if (!digitRegex.test(password)) {
      errors.push("Password must include at least one digit.");
    }

    if (!specialCharRegex.test(password)) {
      errors.push("Password must include at least one special character.");
    }

    return errors;
  };

  const handleSignUp = async () => {
    // Checking if any required field is empty
    if (
      !name ||
      !gender ||
      !email ||
      !password ||
      !cpassword ||
      !year ||
      !semester ||
      !status
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    // Check if the email is valid
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check if password and confirm password match
    if (password !== cpassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      const passwordErrorString = passwordErrors.join("<br />");
      setError(
        <div dangerouslySetInnerHTML={{ __html: passwordErrorString }} />
      );
       
      return;
    }

    try {
      // Check if the email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        // Email is already registered
        setError("This email is already registered.")
        return;
      }

      // Create a new user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Prepare user data to be stored in the Firestore Database
      const userData = {
        email,
        name,
        gender,
        year,
        semester,
        status,
        student_number,
        password,
        type,
      };

      // Reference to the user in the database
      const userDocRef = doc(db, "users", userCredential.user.uid);

      // Set user data in the database
      await setDoc(userDocRef, userData);

      // Clear form fields
      setName("");
      setPassword("");
      setCpassword("");
      setEmail("");
      setGender("");
      setSemester("");
      setStatus("");
      setYear("");
      setStudnum("");

      // Show success message
      toast({
        position: "top",
        title: "Email Verification Sent",
        description: "Please check your email for a verification link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      // Handle the error and show an appropriate toast message
      toast({
        position: "top",
        title: "Sign-up Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex position="relative" justifyContent="center" alignItems="center">
      {showSignIn ? (
        <StudentSignIn />
      ) : (
        <Box pt="3rem" w="29rem">
          <VStack align="flex-start">
            <Text fontSize="2rem" color="white" mb="1rem">
              Sign Up
            </Text>
            <AnimatePresence>
              {error ? (
                <Center
                  bg="#83BF6D"
                  w="65.5%"
                  p=".8rem"
                  borderRadius=".3rem"
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
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
            {/* FULL NAME */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Full Name"
              color="palette.primary"
              w="21rem"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* EMAIL */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Email"
              color="palette.primary"
              w="21rem"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Student Number */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Student Number"
              color="palette.primary"
              w="21rem"
              type="text"
              value={student_number}
              onChange={(e) => setStudnum(e.target.value)}
            />
            <InputGroup size="md">
              {/* PASSWORD */}
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
            {/* CONFIRM PASSWORD */}
            <InputGroup size="md">
              <Input
                bg="palette.secondary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                color="palette.primary"
                w="21rem"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
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
            {/* GENDER AND YEAR */}
            <HStack>
              <Select
                bg="palette.secondary"
                placeholder="Gender"
                color="gray"
                w="10rem"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <Select
                bg="palette.secondary"
                placeholder="Year"
                color="gray"
                ml=".5rem"
                w="10rem"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="BSIT 1">BSIT 1</option>
                <option value="BSIT 2">BSIT 2</option>
                <option value="BSIT 3">BSIT 3</option>
                <option value="BSIT 4">BSIT 4</option>
              </Select>
            </HStack>

            <HStack>
              <Select
                bg="palette.secondary"
                placeholder="Semester"
                color="gray"
                w="10rem"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
                <option value="Summer Semester">Summer Semester</option>
              </Select>

              <Select
                bg="palette.secondary"
                placeholder="Status"
                color="gray"
                ml=".5rem"
                w="10rem"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
                <option value="Shiftee">Shiftee</option>
                <option value="Transferee">Transferee</option>
                <option value="Ladderized">Ladderized</option>
              </Select>
            </HStack>

            <Button
              onClick={() => handleSignUp()}
              height="40px"
              width="21rem"
              borderColor="green.500"
              color="palette.primary"
              mt="2rem"
            >
              Sign Up
            </Button>

            <HStack mt="3rem">
              <Text fontSize="xs" color="gray.400">
                By clicking Sign up you agree to our
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.300">
                Terms
              </Text>
              <Text fontSize="xs" color="gray.400">
                and
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.300">
                Privacy Policy
              </Text>
            </HStack>

            <HStack ml="5rem" mt="1rem">
              <Text
                fontSize="xs"
                color="gray.400"
                variant="link"
                cursor="pointer"
              >
                Already have an account?
              </Text>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.300"
                onClick={toggleSignIn}
                cursor="pointer"
              >
                Sign In
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </Flex>
  );
}
