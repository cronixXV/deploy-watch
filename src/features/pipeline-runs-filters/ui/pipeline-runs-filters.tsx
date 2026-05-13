import {
  Button,
  Card,
  DatePicker,
  Field,
  Grid,
  HStack,
  NativeSelect,
  Portal,
} from '@chakra-ui/react';
import { parseDate } from '@internationalized/date';
import { X } from 'lucide-react';
import { LuCalendar } from 'react-icons/lu';

import { environmentOptions, statusOptions } from '../lib/options';

import type { PipelineFilters } from '@/entities/pipeline/lib/pipeline-filters';
import type { User } from '@/shared/api/mocks/model/types/types';

import { toIsoDate } from '@/shared/lib/format';

type PipelineRunsFiltersProps = {
  filters: PipelineFilters;
  branches: string[];
  users: User[];
  onFilterChange: (name: keyof PipelineFilters, value: string) => void;
  onReset: () => void;
};

export const PipelineRunsFilters = ({
  filters,
  branches,
  users,
  onFilterChange,
  onReset,
}: PipelineRunsFiltersProps) => {
  const datePickerValue = (value?: string) => {
    const isoDate = toIsoDate(value);

    return isoDate ? [parseDate(isoDate)] : [];
  };

  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Body>
        <Grid
          gap="4"
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(6, minmax(0, 1fr))',
          }}
        >
          <Field.Root>
            <Field.Label>Branch</Field.Label>

            <NativeSelect.Root>
              <NativeSelect.Field
                value={filters.branch ?? ''}
                onChange={(event) =>
                  onFilterChange('branch', event.target.value)
                }
              >
                <option value="">All branches</option>

                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>Author</Field.Label>

            <NativeSelect.Root>
              <NativeSelect.Field
                value={filters.authorId ?? ''}
                onChange={(event) =>
                  onFilterChange('authorId', event.target.value)
                }
              >
                <option value="">All authors</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>Status</Field.Label>

            <NativeSelect.Root>
              <NativeSelect.Field
                value={filters.status ?? ''}
                onChange={(event) =>
                  onFilterChange('status', event.target.value)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>Environment</Field.Label>

            <NativeSelect.Root>
              <NativeSelect.Field
                value={filters.environment ?? ''}
                onChange={(event) =>
                  onFilterChange('environment', event.target.value)
                }
              >
                {environmentOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <DatePicker.Root
            value={datePickerValue(filters.startedFrom)}
            onValueChange={(details) =>
              onFilterChange('startedFrom', details.valueAsString[0] ?? '')
            }
          >
            <DatePicker.Label>Started from</DatePicker.Label>

            <DatePicker.Control>
              <DatePicker.Input />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <LuCalendar />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>

            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>

                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>

                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>

          <DatePicker.Root
            value={datePickerValue(filters.startedTo)}
            onValueChange={(details) =>
              onFilterChange('startedTo', details.valueAsString[0] ?? '')
            }
          >
            <DatePicker.Label>Started to</DatePicker.Label>

            <DatePicker.Control>
              <DatePicker.Input />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <LuCalendar />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>

            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>

                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>

                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
        </Grid>

        <HStack justify="flex-end" mt="4">
          <Button size="sm" variant="ghost" onClick={onReset}>
            <X size={16} />
            Reset filters
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
