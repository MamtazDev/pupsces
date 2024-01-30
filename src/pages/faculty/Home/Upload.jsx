import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Select,
  Input,
} from "@chakra-ui/react";

import { AiOutlinePlus } from "react-icons/ai";

function Upload() {
  return (
    <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
      <CardHeader>Upload Curriculum</CardHeader>
      <Divider bg="gray.300" />
      <CardBody ml="2rem" justifyContent="center">
        <HStack flexWrap="wrap">
          <HStack>
            <Select placeholder="Program">
              <option value="BSIT">BSIT</option>
              <option value="BSOA">BSOA</option>
              <option value="DIT">DIT</option>
            </Select>
            <Input placeholder="Year Started" />
          </HStack>
          <HStack alignContent="center" flexWrap="wrap">
            <Button
              style={{
                backgroundColor: "#740202",
                // justifyContent: "flex-end",
                // marginLeft: "50rem",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#950303";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#740202";
                e.currentTarget.style.transform = "scale(1)";
              }}
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              w="11rem"
              focusBorderColor="white"
              leftIcon={<AiOutlinePlus />}
            >
              Upload
            </Button>

            <input type="file" />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default Upload;
