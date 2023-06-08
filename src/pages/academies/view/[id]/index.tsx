import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getAcademyById } from 'apiSdk/academies';
import { Error } from 'components/error';
import { AcademyInterface } from 'interfaces/academy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteAcademyUserById } from 'apiSdk/academy-users';
import { deletePlayerById } from 'apiSdk/players';

function AcademyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AcademyInterface>(
    () => (id ? `/academies/${id}` : null),
    () =>
      getAcademyById(id, {
        relations: ['user', 'academy_user', 'player'],
      }),
  );

  const academy_userHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAcademyUserById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Academy Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
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
            {hasAccess('academy_user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Academy Users:
                </Text>
                <NextLink passHref href={`/academy-users/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.academy_user?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/academy-users/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/academy-users/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => academy_userHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Players:
                </Text>
                <NextLink passHref href={`/players/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>first_name</Th>
                        <Th>last_name</Th>
                        <Th>date_of_birth</Th>
                        <Th>position</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.first_name}</Td>
                          <Td>{record.last_name}</Td>
                          <Td>{record.date_of_birth as unknown as string}</Td>
                          <Td>{record.position}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/players/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/players/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => playerHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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
  entity: 'academy',
  operation: AccessOperationEnum.READ,
})(AcademyViewPage);
