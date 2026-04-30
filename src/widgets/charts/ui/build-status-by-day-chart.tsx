import { Box, Card, Text } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { BuildStatusByDayChartItem } from '@/entities/project';

type BuildStatusByDayChartProps = {
  data: BuildStatusByDayChartItem[];
};

export const BuildStatusByDayChart = ({ data }: BuildStatusByDayChartProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Box>
          <Text fontWeight="semibold">Build success/failure by day</Text>
          <Text color="gray.500" fontSize="sm">
            Completed build outcomes grouped by day.
          </Text>
        </Box>
      </Card.Header>

      <Card.Body>
        {data.length ? (
          <Box h="280px">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#38A169" name="Success" />
                <Bar dataKey="failed" fill="#E53E3E" name="Failed" />
                <Bar dataKey="canceled" fill="#718096" name="Canceled" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box py="12" textAlign="center">
            <Text color="gray.500" fontSize="sm">
              No build data available.
            </Text>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
