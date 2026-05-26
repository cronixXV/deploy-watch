import { formatDuration } from '@/shared/lib/format';
import { MetricCard } from '@/shared/ui/metric-card/ui/metric-card';

type BuildMetricsCardsProps = {
  successRate: number;
  averageBuildDuration?: number;
};

export const BuildMetricsCards = ({
  successRate,
  averageBuildDuration,
}: BuildMetricsCardsProps) => (
  <>
    <MetricCard
      label="Build success rate"
      value={`${successRate}%`}
      description="Based on completed builds"
    />

    <MetricCard
      label="Average build duration"
      value={formatDuration(averageBuildDuration)}
      description="Across builds with recorded duration"
    />
  </>
);
