import { Button, HStack, Stack } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Environment } from '@/shared/api/mocks/model/types/types';

import { InfoRow } from '@/shared/ui/info-row/ui/info-row';
import { MetricCard } from '@/shared/ui/metric-card/ui/metric-card';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';

type EnvironmentHealthCardProps = {
  projectId: string;
  environments: Environment[];
  healthyCount: number;
};

export const EnvironmentHealthCard = ({
  projectId,
  environments,
  healthyCount,
}: EnvironmentHealthCardProps) => (
  <MetricCard
    label="Environment health"
    value={`${healthyCount}/${environments.length}`}
    description="Healthy environments"
  >
    <Stack gap="3">
      <Stack gap="2">
        {environments.map((environment) => (
          <InfoRow key={environment.id} label={environment.name}>
            <StatusBadge status={environment.status} />
          </InfoRow>
        ))}
      </Stack>

      <HStack justify="flex-end">
        <Button colorPalette="teal" size="sm" variant="ghost" asChild>
          <RouterLink to={`/projects/${projectId}/environments`}>
            View environments
            <ArrowRight size={16} />
          </RouterLink>
        </Button>
      </HStack>
    </Stack>
  </MetricCard>
);
