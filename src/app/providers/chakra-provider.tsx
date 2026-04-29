import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import type { ReactNode } from 'react';

type ChakraAppProviderProps = {
  children: ReactNode;
};

export function ChakraAppProvider({ children }: ChakraAppProviderProps) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
