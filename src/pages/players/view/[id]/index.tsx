import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getPlayerById } from 'apiSdk/players';
import { Error } from 'components/error';
import { PlayerInterface } from 'interfaces/player';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerInterface>(
    () => (id ? `/players/${id}` : null),
    () =>
      getPlayerById(id, {
        relations: ['academy', 'user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              First Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.first_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Last Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.last_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Date Of Birth:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.date_of_birth as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Position:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.position}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Created At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.created_at as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Updated At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.updated_at as unknown as string}
            </Text>
            <br />
            {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Academy:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/academies/view/${data?.academy?.id}`}>
                    {data?.academy?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player',
  operation: AccessOperationEnum.READ,
})(PlayerViewPage);
