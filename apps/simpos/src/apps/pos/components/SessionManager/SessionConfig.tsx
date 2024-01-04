import React, { useMemo } from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

import { PosConfig } from '../../../../services/db';

export interface SessionConfigProps {
  config: PosConfig;
  openSession: (configId: number) => void;
}
export const SessionConfig: React.FunctionComponent<SessionConfigProps> = ({
  config,
  openSession,
}) => {
  const status = useMemo<string | undefined>(() => {
    switch (config.posSessionState) {
      case 'opened':
        return 'selling';
      default:
        return undefined;
    }
  }, [config.posSessionState]);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      textAlign="left"
      alignItems="center"
      p={2}
      borderRadius="md"
      backgroundColor="red.100"
      mb={2}
      color="gray.700"
    >
      <Box flex="1">
        <Heading size="sm" fontWeight="medium">
          {config.name}
        </Heading>
        {status && (
          <Text fontWeight="400" fontSize="sm" whiteSpace="normal">
            {config.posSessionUsername} {status}
          </Text>
        )}
      </Box>
      <Box>
        {!config.posSessionState && (
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => openSession(config.id)}
          >
            Open session
          </Button>
        )}
      </Box>
    </Box>
  );
};
