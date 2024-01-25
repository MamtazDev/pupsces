import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import Axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ChangePassword from "./changePassword";

function UserModal({ onClose }) {
  const [userData, setUserData] = useState(null);
  const [programData, setProgramData] = useState(null);

  // State variables for editable fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const formatBirthdate = (birthdate) => {
    const date = new Date(birthdate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  const studentNumber = Cookies.get("student_number");

  useEffect(() => {
    if (studentNumber) {
      const fetchUserData = async () => {
        try {
          const response = await Axios.get(
            `http://localhost:3000/students?studentNumber=${studentNumber}`
          );

          const user = response.data;
          user.birthdate = formatBirthdate(user.birthdate);

          // Set the initial state for editable fields
          setFirstName(user.first_name || "");
          setMiddleName(user.middle_name || "");
          setLastName(user.last_name || "");
          setGender(user.gender || "");
          setBirthdate(new Date(user.birthdate) || null);
          setSelectedProgram(
            (programData &&
              programData.find(
                (program) => program.program_id === user.program_id
              )?.program_name) ||
              ""
          );
          setStatus(user.status || "");
          setEmail(user.email || "");

          setUserData(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [programData, studentNumber]);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await Axios.get("http://localhost:3000/programs");
        setProgramData(response.data);
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Call the fetchProgramData function when the component mounts
    fetchProgramData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await Axios.put(
        `http://localhost:3000/updatestudents/${studentNumber}`,
        {
          student_number: studentNumber,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          gender: gender,
          birthdate: new Date(birthdate).toISOString().split("T")[0],
          program_id: programData.find(
            (program) => program.program_name === selectedProgram
          )?.program_id,
          status: status,
          email: email,
        }
      );

      // Log the response (You might want to handle it differently)
      console.log("User data updated:", response.data);
      onClose(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          padding="2rem"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <VStack spacing={2.5} alignItems="flex-start">
            <HStack gap="2rem">
              <HStack>
                <Text>First</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                ml=".8rem"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ border: "1px solid #ccc", width: "20rem" }}
              />
            </HStack>
            <HStack>
              <HStack>
                <Text>Middle</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                ml="1rem"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{ border: "1px solid #ccc", width: "20rem" }}
              />
            </HStack>
            <HStack>
              <HStack>
                <Text>Last</Text>
                <Text>Name:</Text>
              </HStack>
              <Input
                ml="2.2rem"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ border: "1px solid #ccc", width: "20rem" }}
              />
            </HStack>
            <HStack>
              <Text>Email:</Text>
              <Input
                ml="4.7rem"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "20rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              />
            </HStack>
            <HStack>
              <Text>Gender:</Text>
              <Select
                ml="4rem"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ border: "1px solid #ccc", width: "20rem" }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </HStack>
            <HStack gap="4rem">
              <Text>Birthdate:</Text>
              <DatePicker
                selected={birthdate}
                onChange={(date) => setBirthdate(date)}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Birthdate"
                dateFormat="MM/dd/yyyy"
                maxDate={new Date()}
                style={{ border: "1px solid black", padding: "0.2rem" }}
              />
            </HStack>
            <HStack>
              <Text>Program:</Text>
              <Select
                ml="3.2rem"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                style={{
                  width: "20rem",
                  border: "1px solid #ccc",
                  padding: "0.2rem",
                }}
              >
                {programData &&
                  programData.map((program) => (
                    <option
                      key={program.program_id}
                      value={program.program_name}
                    >
                      {program.program_name}
                    </option>
                  ))}
              </Select>
            </HStack>
            <HStack>
              <Text>Status:</Text>
              <Select
                ml="4.3rem"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "20rem",
                  border: "1px solid #ccc",
                  padding: "0.2rem",
                }}
              >
                <option value="Regular">Regular</option>
                <option value="Back Subject">Back Subject</option>
                <option value="Transferee">Transferee</option>
                <option value="Shiftee">Shiftee</option>
                <option value="Ladderized">Ladderized</option>
              </Select>
            </HStack>
            <Button onClick={handleOpenChangePasswordModal}>
              Change Password
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4} justify="flex-end">
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
            <Button colorScheme="teal" onClick={onClose}>
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
      {isChangePasswordModalOpen && (
        <ChangePassword
          isOpen={isChangePasswordModalOpen}
          onClose={handleCloseChangePasswordModal}
        />
      )}
    </Modal>
  );
}

UserModal.propTypes = {
  onClose: PropTypes.func,
};

export default UserModal;
