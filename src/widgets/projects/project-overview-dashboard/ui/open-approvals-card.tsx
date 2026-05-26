import { Button } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { MetricCard } from '@/shared/ui/metric-card/ui/metric-card';

type OpenApprovalsCardProps = {
  count: number;
};

export const OpenApprovalsCard = ({ count }: OpenApprovalsCardProps) => (
  <MetricCard
    label="Open approvals"
    value={count}
    description="Deployments waiting for approval"
    action={
      <Button
        colorPalette={count > 0 ? 'yellow' : 'gray'}
        size="sm"
        variant="outline"
        asChild
      >
        <RouterLink to="/approvals">
          Review approvals
          <ArrowRight size={16} />
        </RouterLink>
      </Button>
    }
  />
);
