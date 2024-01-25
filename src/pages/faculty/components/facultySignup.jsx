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
} from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FacultySignIn from "./facultySignin";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../app-service/firebase-config";



export default function FacultySignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const toast = useToast();

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  //styling the eye for password
  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //condition for password validation
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
    if (!name || !gender || !email || !password || !cpassword || !birthdate) {
      toast({
        position: "top",
        title: "Missing Fields!",
        description: "Please fill in all fields.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (!validateEmail(email)) {
      toast({
        position: "top",
        title: "Invalid Email!",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    // Check if password and confirm password match
    if (password !== cpassword) {
      toast({
        position: "top",
        title: "Password Mismatch!",
        description: "Password and Confirm Password do not match.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      const passwordErrorString = passwordErrors.join("<br />");
      toast({
        position: "top",
        title: "Password Validation Failed!",
        description: (
          <div dangerouslySetInnerHTML={{ __html: passwordErrorString }} />
        ),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      // Check if the email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
       
        toast({
          position: "top",
          title: "Invalid Email!",
          description: "This email is already registered.",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        return;
      }

      // Create a new user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const type = "Faculty";

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Prepare user data to be stored in the Firestore Database
      const userData = {
        email,
        name,
        gender,
        birthdate,
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
      setBirthdate("");

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
        <FacultySignIn />
      ) : (
        <Box pt="5rem" w="29rem">
          <VStack align="flex-start">
            <Text fontSize="2rem" color="white" mb="1.5rem">
              Sign Up
            </Text>
            {/* FULLNAME */}
            <Input
              bg="palette.secondary"
              color="palette.primary"
              variant="outline"
              placeholder="Full Name"
              w="21rem"
              focusBorderColor="palette.secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* EMAIL */}
            <Input
              bg="palette.secondary"
              color="palette.primary"
              variant="outline"
              placeholder="Email"
              w="21rem"
              type="email"
              focusBorderColor="palette.secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* PASSWORD */}
            <InputGroup size="md">
              <Input
                bg="palette.secondary"
                color="palette.primary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                w="21rem"
                focusBorderColor="palette.secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem" mr="8rem">
                <Button
                  style={buttonStyles}
                  h="1.75rem"
                  size="sm"
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
            {/* CONFRIM PASSWORD */}
            <InputGroup size="md">
              <Input
                bg="palette.secondary"
                color="palette.primary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                w="21rem"
                focusBorderColor="palette.secondary"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />
              <InputRightElement width="4.5rem" mr="8rem">
                <Button
                  style={buttonStyles}
                  h="1.75rem"
                  size="sm"
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
            {/* GENDER */}
            <HStack>
              <Select
                focusBorderColor="palette.secondary"
                bg="palette.secondary"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Gender"
                color="gray"
                w="21rem"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </HStack>

            <DatePicker
              customInput={
                <Input
                  focusBorderColor="palette.secondary"
                  w="21rem"
                  bg="palette.secondary"
                  style={{ borderRadius: "5px" }}
                />
              }
              selected={birthdate}
              onChange={(date) => setBirthdate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Birthdate"
              dateFormat="MM/dd/yyyy"
              maxDate={new Date()}
            />

            <Button
              onClick={() => handleSignUp()}
              mt="3rem"
              size="md"
              height="40px"
              width="21rem"
              border="2px"
            
              color="palette.primary"
              focusBorderColor="palette.secondary"
            >
              Sign Up
            </Button>

            <HStack mt="3rem">
              <Text fontSize="xs" color="gray">
                By clicking Sign up you agree to our
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray">
                Terms
              </Text>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray">
                Privacy Policy
              </Text>
            </HStack>

            <HStack ml="5rem">
              <Text fontSize="xs" color="gray" cursor="pointer">
                Already have an account?
              </Text>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray"
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
