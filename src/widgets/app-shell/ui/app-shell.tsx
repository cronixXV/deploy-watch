import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/app/store/hooks';
import { LogoutButton } from '@/features/auth';
import { formatRole } from '@/shared/api/mocks/lib/format-role';

const navItems = [
  { label: 'Projects', to: '/projects' },
  { label: 'Approvals', to: '/approvals' },
  { label: 'Settings', to: '/settings' },
];

export function AppShell() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box minH="100vh" bg="gray.50" color="gray.900">
      <Flex minH="100vh">
        <Box
          as="aside"
          w="260px"
          borderRightWidth="1px"
          borderColor="gray.200"
          bg="white"
          px="4"
          py="5"
        >
          <Heading mb="8" size="md" letterSpacing="-0.03em">
            Deploy
            <Box as="span" color="teal.600">
              Watch
            </Box>
          </Heading>

          <VStack align="stretch" gap="1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <Box
                    borderRadius="md"
                    px="3"
                    py="2"
                    color={isActive ? 'teal.700' : 'gray.600'}
                    bg={isActive ? 'teal.50' : 'transparent'}
                    fontSize="sm"
                    fontWeight="medium"
                    transition="background 0.15s ease, color 0.15s ease"
                    _hover={{
                      bg: isActive ? 'teal.50' : 'gray.100',
                      color: isActive ? 'teal.700' : 'gray.900',
                    }}
                  >
                    {item.label}
                  </Box>
                )}
              </NavLink>
            ))}
          </VStack>
        </Box>

        <Flex minW="0" flex="1" direction="column">
          <HStack
            as="header"
            minH="64px"
            justify="space-between"
            borderBottomWidth="1px"
            borderColor="gray.200"
            bg="whiteAlpha.900"
            px="8"
          >
            <Text fontSize="sm" fontWeight="semibold">
              CI/CD Monitoring Dashboard
            </Text>

            <HStack gap="4">
              <Box textAlign="right">
                <Text color="gray.700" fontSize="sm" fontWeight="medium">
                  {user?.name ?? 'Unknown user'}
                </Text>

                <Text color="gray.500" fontSize="xs">
                  {formatRole(user?.role)}
                </Text>
              </Box>

              <LogoutButton />
            </HStack>
          </HStack>

          <Box as="main" w="100%" maxW="1440px" p="8">
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
