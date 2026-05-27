import {
  Box,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  HStack,
  NativeSelect,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { RotateCcw } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  defaultProjectChanged,
  notificationsToggled,
  pollingIntervalChanged,
  settingsReset,
  type PollingInterval,
} from '@/app/store/slices/settings-slice';
import { useProjectsQuery } from '@/entities/project';
import { InfoRow } from '@/shared/ui/info-row/ui/info-row';

const pollingIntervalOptions: Array<{
  label: string;
  value: PollingInterval;
}> = [
  { label: '3 seconds', value: 3000 },
  { label: '5 seconds', value: 5000 },
  { label: '10 seconds', value: 10000 },
  { label: '30 seconds', value: 30000 },
];

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const projectsQuery = useProjectsQuery();

  const selectedDefaultProjectName =
    projectsQuery.data?.find(
      (project) => project.id === settings.defaultProjectId,
    )?.name ?? 'Not selected';

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Settings</Heading>

        <Text color="gray.500" mt="2">
          Configure DeployWatch preferences for live updates, notifications and
          dashboard behaviour.
        </Text>
      </Box>

      <Grid
        gap="4"
        templateColumns={{
          base: '1fr',
          xl: '2fr 1fr',
        }}
      >
        <Card.Root bg="white" borderColor="gray.200" shadow="sm">
          <Card.Header>
            <Box>
              <Text fontWeight="semibold">Dashboard preferences</Text>

              <Text color="gray.500" fontSize="sm">
                These settings are saved locally in your browser.
              </Text>
            </Box>
          </Card.Header>

          <Card.Body>
            <Stack gap="5">
              <Field.Root>
                <Field.Label>Polling interval</Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={settings.pollingInterval}
                    onChange={(event) =>
                      dispatch(
                        pollingIntervalChanged(
                          Number(event.target.value) as PollingInterval,
                        ),
                      )
                    }
                  >
                    {pollingIntervalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect.Field>

                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Field.HelperText>
                  Used for live pipeline, build and log updates.
                </Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>Default project</Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={settings.defaultProjectId ?? ''}
                    onChange={(event) =>
                      dispatch(
                        defaultProjectChanged(event.target.value || null),
                      )
                    }
                  >
                    <option value="">No default project</option>

                    {projectsQuery.data?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </NativeSelect.Field>

                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Field.HelperText>
                  Used as preferred project when opening the dashboard.
                </Field.HelperText>
              </Field.Root>

              <SettingSwitch
                checked={settings.notificationsEnabled}
                description="Show toast notifications for approvals, rollback actions and pipeline failures."
                label="Notifications enabled"
                onCheckedChange={(checked) =>
                  dispatch(notificationsToggled(checked))
                }
              />
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root bg="white" borderColor="gray.200" shadow="sm">
          <Card.Header>
            <Box>
              <Text fontWeight="semibold">Current settings</Text>

              <Text color="gray.500" fontSize="sm">
                Active local preferences.
              </Text>
            </Box>
          </Card.Header>

          <Card.Body>
            <Stack gap="4">
              <InfoRow
                label="Polling"
                value={`${settings.pollingInterval / 1000}s`}
              />

              <InfoRow
                label="Default project"
                value={selectedDefaultProjectName}
              />

              <InfoRow
                label="Notifications"
                value={settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
              />

              <InfoRow
                label="Compact tables"
                value={settings.compactTableMode ? 'Enabled' : 'Disabled'}
              />

              <Button
                colorPalette="red"
                mt="2"
                size="sm"
                variant="outline"
                onClick={() => dispatch(settingsReset())}
              >
                <RotateCcw size={16} />
                Reset settings
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Stack>
  );
}

type SettingSwitchProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function SettingSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <HStack justify="space-between" gap="4">
      <Box>
        <Text fontWeight="medium">{label}</Text>

        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </Box>

      <Switch.Root
        checked={checked}
        onCheckedChange={(details) => onCheckedChange(details.checked)}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </HStack>
  );
}
