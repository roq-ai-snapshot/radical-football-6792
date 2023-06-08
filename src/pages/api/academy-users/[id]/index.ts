import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { academyUserValidationSchema } from 'validationSchema/academy-users';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.academy_user
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAcademyUserById();
    case 'PUT':
      return updateAcademyUserById();
    case 'DELETE':
      return deleteAcademyUserById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAcademyUserById() {
    const data = await prisma.academy_user.findFirst(convertQueryToPrismaUtil(req.query, 'academy_user'));
    return res.status(200).json(data);
  }

  async function updateAcademyUserById() {
    await academyUserValidationSchema.validate(req.body);
    const data = await prisma.academy_user.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteAcademyUserById() {
    const data = await prisma.academy_user.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
