import { Badge, Box, HStack, Stack, Text } from '@chakra-ui/react';
import { GitCommit, Lock, Unlock } from 'lucide-react';

import type { Environment, User } from '@/shared/api/mocks/model/types/types';

import {
  getEnvironmentHealthDescription,
  getEnvironmentHealthLabel,
} from '@/entities/environment';
import { getUserNameById } from '@/entities/user';
import { formatDate, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import {
  SummaryGrid,
  SummaryGridItem,
} from '@/shared/ui/summary-grid/ui/summary-grid';

type EnvironmentCardProps = {
  environment: Environment;
  users: User[];
};

export const EnvironmentCard = ({
  environment,
  users,
}: EnvironmentCardProps) => {
  const statusColor = getStatusColor(environment.status);
  const lockColor = getStatusColor(environment.locked ? 'locked' : 'healthy');
  const LockIcon = environment.locked ? Lock : Unlock;

  return (
    <DefaultCard
      title={
        <HStack gap="2">
          <Text fontSize="lg" fontWeight="semibold">
            {formatStatus(environment.name)}
          </Text>

          <Badge colorPalette={statusColor} variant="subtle">
            {formatStatus(environment.status)}
          </Badge>
        </HStack>
      }
      description={getEnvironmentHealthDescription(environment)}
      action={
        <Badge colorPalette={lockColor} variant="outline">
          <HStack gap="1">
            <LockIcon size={14} />
            <Text as="span">{environment.locked ? 'Locked' : 'Unlocked'}</Text>
          </HStack>
        </Badge>
      }
    >
      <Stack gap="5">
        <Box
          rounded="lg"
          borderWidth="1px"
          borderColor={`${statusColor}.200`}
          bg={`${statusColor}.50`}
          p="4"
        >
          <HStack justify="space-between">
            <Box>
              <Text
                color={`${statusColor}.700`}
                fontSize="sm"
                fontWeight="semibold"
              >
                Health
              </Text>

              <Text color={`${statusColor}.700`} fontSize="xs" mt="1">
                {getEnvironmentHealthLabel(environment)}
              </Text>
            </Box>

            <Badge colorPalette={statusColor} variant="solid">
              {environment.activeIncidents}{' '}
              {environment.activeIncidents === 1 ? 'incident' : 'incidents'}
            </Badge>
          </HStack>
        </Box>

        <SummaryGrid>
          <SummaryGridItem label="Current version">
            <Text fontWeight="medium">{environment.currentVersion}</Text>
          </SummaryGridItem>

          <SummaryGridItem label="Current commit">
            <HStack gap="2">
              <GitCommit size={14} />
              <Text fontFamily="mono">{environment.currentCommitHash}</Text>
            </HStack>
          </SummaryGridItem>

          <SummaryGridItem label="Last deployment">
            <Text>{formatDate(environment.lastDeploymentAt)}</Text>
          </SummaryGridItem>

          <SummaryGridItem label="Deployed by">
            <Text>{getUserNameById(users, environment.deployedById)}</Text>
          </SummaryGridItem>
        </SummaryGrid>
      </Stack>
    </DefaultCard>
  );
};
