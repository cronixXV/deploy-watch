import { Box, Card, Text } from '@chakra-ui/react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { AverageBuildDurationChartItem } from '@/entities/build';

import { formatDuration } from '@/shared/lib/format';

type AverageBuildDurationChartProps = {
  data: AverageBuildDurationChartItem[];
};

export const AverageBuildDurationChart = ({
  data,
}: AverageBuildDurationChartProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Average build duration</Text>
          <Text color="gray.500" fontSize="sm">
            Average duration of completed builds by day.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        {data.length ? (
          <Box h="280px">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis
                  tickFormatter={(value) => formatDuration(Number(value))}
                />
                <Tooltip
                  formatter={(value) => [
                    formatDuration(Number(value)),
                    'Average duration',
                  ]}
                />
                <Line
                  activeDot={{ r: 6 }}
                  dataKey="averageDurationSec"
                  dot
                  name="Average duration"
                  stroke="#319795"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box py="12" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No duration data available.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
