import { Box, Card, Text } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DeploymentActivityByEnvironmentChartItem } from '@/entities/project';

import { formatStatus } from '@/shared/lib/format';

type DeploymentActivityByEnvironmentChartProps = {
  data: DeploymentActivityByEnvironmentChartItem[];
};

export const DeploymentActivityByEnvironmentChart = ({
  data,
}: DeploymentActivityByEnvironmentChartProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Deployment activity by environment</Text>
          <Text color="gray.500" fontSize="sm">
            Deployment volume across project environments.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        {data.length ? (
          <Box h="260px">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="environment"
                  tickFormatter={(value) => formatStatus(String(value))}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(value) => formatStatus(String(value))}
                />
                <Bar dataKey="deployments" fill="#805AD5" name="Deployments" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box py="12" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No deployment data available.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
