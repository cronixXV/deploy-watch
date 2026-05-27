import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginSchema, type LoginFormValues } from '../model/schemas/schema';

import { useAppDispatch } from '@/app/store/hooks';
import { loginSucceeded } from '@/app/store/slices/auth-slice';
import { useLoginMutation } from '@/entities/auth';
import { useAppToast } from '@/shared/hooks/use-app-toast';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const appToast = useAppToast();

  const loginMutation = useLoginMutation();

  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ?? '/projects';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormValues>,
    defaultValues: {
      email: 'alex@deploywatch.dev',
      password: 'password',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      dispatch(
        loginSucceeded({
          user: result.user,
          token: result.token,
        }),
      );

      appToast.success('Signed in successfully');

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      appToast.errorFromUnknown(error);
    }
  });

  return (
    <Box
      as="form"
      w="100%"
      maxW="420px"
      rounded="xl"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      p="8"
      shadow="sm"
      onSubmit={onSubmit}
    >
      <Stack gap="6">
        <Stack gap="2">
          <Heading size="lg">Sign in</Heading>

          <Text color="gray.500" fontSize="sm">
            Use your DeployWatch account to continue.
          </Text>
        </Stack>

        <Stack gap="4">
          <Field.Root invalid={Boolean(errors.email)}>
            <Field.Label>Email</Field.Label>

            <Input
              placeholder="alex@deploywatch.dev"
              type="email"
              {...register('email')}
            />

            {errors.email?.message && (
              <Field.ErrorText>{errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={Boolean(errors.password)}>
            <Field.Label>Password</Field.Label>

            <Input
              placeholder="Enter password"
              type="password"
              {...register('password')}
            />

            {errors.password?.message && (
              <Field.ErrorText>{errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>
        </Stack>

        <Button
          colorPalette="teal"
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
          type="submit"
        >
          Sign in
        </Button>

        <Text color="gray.500" fontSize="xs">
          Demo user: alex@deploywatch.dev / password
        </Text>
      </Stack>
    </Box>
  );
};
