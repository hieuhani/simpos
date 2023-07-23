import { Box, Grid, Heading, Flex, Tag, Text } from '@chakra-ui/react';
import get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { useMoneyFormatter } from '../../../../hooks';
import {
  orderService,
  RemotePaymentGroup,
  RemotePosPayment,
} from '../../../../services/order';

export interface SessionPaymentsProps {
  sessionId: number;
}
export const SessionPayments: React.FunctionComponent<SessionPaymentsProps> = ({
  sessionId,
}) => {
  const [paymentGroups, setPaymentGroups] = useState<RemotePaymentGroup[]>([]);
  const [methodPayments, setMethodPayments] = useState<
    Record<string, RemotePosPayment[]>
  >({});
  const { formatCurrency } = useMoneyFormatter();

  useEffect(() => {
    const getSessionPayments = async () => {
      const data = await orderService.getSessionPaymentGroups(sessionId);
      const groups = get(data, 'groups', []);
      const paymentMethodIds = groups.map(
        (group: RemotePaymentGroup) => group.paymentMethodId[0],
      );
      const payments = await Promise.all(
        paymentMethodIds.map((paymentMethodId: number) =>
          orderService
            .getSessionPayments(sessionId, paymentMethodId)
            .then((posPayments) => {
              return {
                paymentMethodId,
                payments: posPayments,
              };
            }),
        ),
      );
      setMethodPayments(
        payments.reduce(
          (prev: Record<string, RemotePosPayment[]>, current: any) => {
            return {
              ...prev,
              [current.paymentMethodId]: current.payments,
            };
          },
          {},
        ) as Record<string, RemotePosPayment[]>,
      );
      setPaymentGroups(groups);
    };
    getSessionPayments();
  }, [sessionId]);

  return (
    <Grid px={6} gridGap={6} templateColumns="1fr 1fr" pb={6} mt={4}>
      {paymentGroups.map((paymentGroup, index) => (
        <Box key={index} backgroundColor="white" borderRadius="md" p={4}>
          <Flex alignItems="center" justifyContent="space-between" pb={3}>
            <Heading fontSize="lg">{paymentGroup.paymentMethodId[1]}</Heading>
            <Tag colorScheme="pink">{formatCurrency(paymentGroup.amount)}</Tag>
          </Flex>
          {methodPayments[paymentGroup.paymentMethodId[0]] && (
            <Box>
              {methodPayments[paymentGroup.paymentMethodId[0]].map(
                (payment) => (
                  <Flex
                    key={payment.id}
                    alignItems="center"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    justifyContent="space-between"
                    py={2}
                  >
                    <Box>
                      <Text fontWeight="medium">{payment.posOrderId[1]}</Text>
                      <Text>{payment.paymentDate.substring(0, 10)}</Text>
                    </Box>
                    <Tag>{formatCurrency(payment.amount)}</Tag>
                  </Flex>
                ),
              )}
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
};
