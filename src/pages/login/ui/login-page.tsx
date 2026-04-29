import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Flex flex="1" align="center" justify="center" px="6" py="10">
        <LoginForm />
      </Flex>

      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex="1"
        alignItems="center"
        justifyContent="center"
        bg="teal.600"
        color="white"
        px="12"
      >
        <Box maxW="520px">
          <Heading mb="4" size="2xl" letterSpacing="-0.04em">
            DeployWatch
          </Heading>

          <Text color="teal.50" fontSize="lg" lineHeight="1.8">
            Monitor CI/CD pipelines, deployments, approvals and environments
            from one engineering dashboard.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
