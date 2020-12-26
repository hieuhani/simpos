import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getLoadModelsMap } from '../../../../contexts/DataProvider/dataLoader';
import {
  PosConfig,
  posConfigRepository,
  PosSession,
  posSessionRepository,
} from '../../../../services/db';
import { AuthUserMeta } from '../../../../services/db/root';
import { posConfigService } from '../../../../services/pos-config';
import { SessionConfig } from './SessionConfig';

export interface SessionManagerProps {
  authUserMeta: AuthUserMeta;
  onSessionSelected: (session: PosSession) => void;
}
export const SessionManager: React.FunctionComponent<SessionManagerProps> = ({
  authUserMeta,
  onSessionSelected,
}) => {
  const [configs, setConfigs] = useState<PosConfig[]>([]);

  const updateSession = (posSessions: PosSession[]) => {
    const assignedSession = posSessions.find(
      (session) => session.responsibleUserId === authUserMeta.uid,
    );

    if (assignedSession) {
      onSessionSelected(assignedSession);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const posConfigs = await posConfigRepository.all();
      const posSessions = await posSessionRepository.all();
      setConfigs(posConfigs);
      updateSession(posSessions);
    };
    fetchSession();
  }, [authUserMeta, onSessionSelected]);

  const openSession = async (configId: number) => {
    await posConfigService.createSession(configId);
    const loadModelsMap = getLoadModelsMap();
    const posSessions = await loadModelsMap['pos.session'].load({
      nocache: true,
    });
    updateSession(posSessions);
  };

  if (configs.length === 0) {
    return null;
  }

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chọn phiên bán hàng</ModalHeader>
        <ModalBody>
          {configs.map((config) => (
            <SessionConfig
              key={config.id}
              config={config}
              openSession={openSession}
            />
          ))}
          <Box h={3} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
