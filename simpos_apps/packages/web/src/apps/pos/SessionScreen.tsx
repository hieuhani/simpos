import { Container, Box, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { PosSession } from '../../services/db';
import { posSessionService } from '../../services/pos-session';
import { NavigationBarGeneral } from './components/NavigationBar';
import { SessionDataView } from './components/SessionDataView';
import { SessionSummary } from './components/SessionSummary';

export const SessionScreen: React.FunctionComponent = () => {
  const [session, setSession] = useState<PosSession>();
  const [loading, setLoading] = useState(false);
  const { posSession } = useData();

  useEffect(() => {
    const getSession = async () => {
      const sessionData = await posSessionService.getSession(posSession.id);
      setSession(sessionData);
    };
    getSession();
  }, [posSession.id]);

  const closeSession = async () => {
    setLoading(true);
    await posSessionService.closeSession(posSession.id);
    // getSession();
    // setLoading(true);
    window.location.reload();
  };

  return (
    <>
      <NavigationBarGeneral />

      <Box height="calc(100vh - 112px)" overflowY="auto">
        {session && (
          <Container maxW="6xl" pt={4}>
            <SessionSummary session={session} />
            <SessionDataView sessionId={session.id} />
          </Container>
        )}
      </Box>

      {session?.state === 'opened' && (
        <Box position="fixed" bottom="0" left="0" right="0">
          <Container maxW="6xl" py={2}>
            <Button
              colorScheme="pink"
              w="full"
              disabled={loading}
              isLoading={loading}
              onClick={closeSession}
            >
              Đóng phiên
            </Button>
          </Container>
        </Box>
      )}
    </>
  );
};

export default SessionScreen;
