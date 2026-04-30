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

import type { PipelineStatusDistributionChartItem } from '@/entities/project';

import { formatStatus } from '@/shared/lib/format';

type PipelineStatusDistributionChartProps = {
  data: PipelineStatusDistributionChartItem[];
};

export const PipelineStatusDistributionChart = ({
  data,
}: PipelineStatusDistributionChartProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Pipeline status distribution</Text>
          <Text color="gray.500" fontSize="sm">
            Number of pipeline runs by current status.
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
                  dataKey="status"
                  tickFormatter={(value) => formatStatus(String(value))}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(value) => formatStatus(String(value))}
                />
                <Bar dataKey="count" fill="#3182CE" name="Pipelines" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box py="12" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No pipeline data available.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
