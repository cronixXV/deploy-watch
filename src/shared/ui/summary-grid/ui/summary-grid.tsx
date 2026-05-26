import { DataList } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type SummaryGridProps = {
  children: ReactNode;
};

export const SummaryGrid = ({ children }: SummaryGridProps) => (
  <DataList.Root
    orientation="vertical"
    gap="4"
    display="grid"
    gridTemplateColumns={{
      base: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
    }}
  >
    {children}
  </DataList.Root>
);

type SummaryGridItemProps = {
  label: ReactNode;
  children: ReactNode;
};

export const SummaryGridItem = ({ label, children }: SummaryGridItemProps) => (
  <DataList.Item>
    <DataList.ItemLabel>{label}</DataList.ItemLabel>
    <DataList.ItemValue>{children}</DataList.ItemValue>
  </DataList.Item>
);
