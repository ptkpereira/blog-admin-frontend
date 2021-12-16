import Head from "next/head";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";

function Layout({ children, noHeader, profile, activityBtn, painel }) {
  return (
    <Box>
      <Head>
        <title>Blog Admin</title>
      </Head>
      <Box>
        <Flex flexDirection="column" w="100%">
          <Header />
          {children}
        </Flex>
      </Box>
    </Box>
  );
}

export default Layout;
