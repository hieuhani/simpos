import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { PosSession, posSessionRepository } from '../../../../services/db';
import { AuthUserMeta } from '../../../../services/db/root';

export interface SessionManagerProps {
  authUserMeta: AuthUserMeta;
  onSessionSelected: (session: PosSession) => void;
}
export const SessionManager: React.FunctionComponent<SessionManagerProps> = ({
  authUserMeta,
  onSessionSelected,
}) => {
  const [sessions, setSessions] = useState<PosSession[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const posSessions = await posSessionRepository.all();
      setSessions(posSessions);
      const assignedSession = posSessions.find(
        (session) => session.responsibleUserId === authUserMeta.uid,
      );

      if (assignedSession) {
        onSessionSelected(assignedSession);
      }
    };
    fetchSession();
  }, [authUserMeta, onSessionSelected]);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chọn phiên bán hàng</ModalHeader>
        <ModalBody>Hello</ModalBody>
      </ModalContent>
    </Modal>
  );
};
