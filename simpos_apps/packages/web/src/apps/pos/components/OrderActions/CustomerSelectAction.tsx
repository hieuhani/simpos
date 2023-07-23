import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { IconSmile } from '../../../../components/icons/output/IconSmile';
import { IconSearch } from '../../../../components/icons';
import { Partner, partnerRepository } from '../../../../services/db';
import { CustomerRow } from '../CustomerSelect';
import {
  useOrderManagerAction,
  useOrderManagerState,
} from '../../../../contexts/OrderManager';
import { UpdateCustomerForm } from './UpdateCustomerForm';
import { useDebounce } from '../../../../hooks/use-debounce';

export const CustomerSelectAction: React.FunctionComponent = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectPartnerId, setSelectedPartnerId] = useState(0);
  const { activeOrder } = useOrderManagerState();
  const [customerFormDisplayed, setCustomerFormDisplayed] = useState(false);
  const toggleCustomerForm = () => {
    setCustomerFormDisplayed(!customerFormDisplayed);
  };
  const { selectCustomer } = useOrderManagerAction();
  const fetchPartners = async () => {
    const foundPartners = await partnerRepository.findPartners(
      debouncedKeyword,
    );
    setPartners(foundPartners);
  };
  useEffect(() => {
    fetchPartners();
  }, [debouncedKeyword]);
  useEffect(() => {
    if (activeOrder?.order.partnerId) {
      setSelectedPartnerId(activeOrder.order.partnerId);
    }
  }, [activeOrder?.order.partnerId]);

  const onSelectCustomer = (partner: Partner) => {
    setSelectedPartnerId(partner.id);
  };

  const commitSelectCustomer = () => {
    selectCustomer(selectPartnerId);
    onClose();
  };

  const unselectCustomer = () => {
    setSelectedPartnerId(0);
    selectCustomer(undefined);
    onClose();
  };

  const onCustomerClose = (value: Partner | undefined) => {
    if (value) {
      setPartners([value, ...partners]);
      setSelectedPartnerId(value.id);
    }

    toggleCustomerForm();
  };
  return (
    <>
      <Box
        as="button"
        backgroundColor="brand.500"
        p={2}
        w="full"
        height="66px"
        display="flex"
        textAlign="left"
        alignItems="center"
        borderRadius="md"
        color="brand.100"
        _focus={{
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
        }}
        onClick={onOpen}
      >
        {activeOrder?.order.partner ? (
          <>
            <Avatar name={activeOrder.order.partner.name} w="36px" h="36px" />
            <Box ml={2}>
              <Heading size="md" fontWeight="medium">
                {activeOrder.order.partner.name}
              </Heading>
              <Text fontSize="sm" fontWeight="400">
                {activeOrder.order.partner.phone}
              </Text>
            </Box>
          </>
        ) : (
          <>
            <IconSmile size="36" />
            <Heading size="md" fontWeight="medium" ml={2}>
              Chọn khách hàng
            </Heading>
          </>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Chọn khách hàng
            <HStack mb={2} mt={2}>
              <InputGroup size="md">
                <Input
                  pr="3rem"
                  value={keyword}
                  placeholder="Tìm kiếm"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <InputRightElement width="3rem">
                  <IconSearch size="20" color="gray" />
                </InputRightElement>
              </InputGroup>
              <Button onClick={toggleCustomerForm} colorScheme="blue">
                {customerFormDisplayed ? 'Đóng' : 'Thêm'}
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {customerFormDisplayed && (
              <UpdateCustomerForm onClose={onCustomerClose} />
            )}
            <Stack spacing={2}>
              {partners.map((partner) => (
                <CustomerRow
                  key={partner.id}
                  customer={partner}
                  checked={selectPartnerId === partner.id}
                  onClick={() => onSelectCustomer(partner)}
                />
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            {activeOrder?.order.partnerId && (
              <Button
                mr={2}
                colorScheme="red"
                variant="outline"
                onClick={unselectCustomer}
              >
                Bỏ chọn
              </Button>
            )}
            <Button
              colorScheme="red"
              onClick={commitSelectCustomer}
              disabled={
                !selectPartnerId ||
                selectPartnerId === activeOrder?.order.partnerId
              }
            >
              Chọn
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
