import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
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
  const fetchSession = async () => {
    const sessions = await posSessionRepository.all();
    const assignedSession = sessions.find(
      (session) => session.responsibleUserId === authUserMeta.uid,
    );
    if (assignedSession) {
      onSessionSelected(assignedSession);
    }
  };

  useEffect(() => {
    fetchSession();
  });
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
