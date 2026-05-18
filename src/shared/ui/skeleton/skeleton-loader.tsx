import { Skeleton, Stack } from '@chakra-ui/react';

export const SkeletonLoader = () => (
  <Stack gap="6">
    <Skeleton h="32px" w="320px" />
    <Skeleton h="180px" rounded="xl" />
    <Skeleton h="260px" rounded="xl" />
  </Stack>
);
