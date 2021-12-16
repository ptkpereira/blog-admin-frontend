import { Flex, Container, Box, Text, Spacer } from "@chakra-ui/react";
import Link from "next/link";

export default function Header() {
  return (
    <Box py="15px" borderBottom="solid 0.5px rgba(255, 255, 255, 0.13)">
      <Container maxW="container.xl">
        <Flex>
          <Link href="/">
            <Text fontWeight="bold" fontSize="1.5rem" cursor="pointer">
              Blog Admin
            </Text>
          </Link>
          <Spacer />
        </Flex>
      </Container>
    </Box>
  );
}
