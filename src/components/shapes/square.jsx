import { Flex, useTheme } from "@chakra-ui/react";

function Square() {
  const theme = useTheme();
  const primaryColor = theme.colors.palette.primary;

  return (
    <Flex>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50vw",
          height: "100vh",
          backgroundColor: primaryColor,
          transition: "all 0.2s ease",
        }}
      />
    </Flex>
  );
}

export default Square;
