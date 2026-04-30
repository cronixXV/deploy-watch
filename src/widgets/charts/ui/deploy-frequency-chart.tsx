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

import type { DeployFrequencyChartItem } from '@/entities/project';

type DeployFrequencyChartProps = {
  data: DeployFrequencyChartItem[];
};

export const DeployFrequencyChart = ({ data }: DeployFrequencyChartProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Deploy frequency</Text>
          <Text color="gray.500" fontSize="sm">
            Number of deployments grouped by day.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        {data?.length ? (
          <Box h="260px">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="deployments" fill="#319795" name="Deployments" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box py="12" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No deployment frequency data available.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
