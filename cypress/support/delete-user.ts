// Use this to delete a user by their email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { installGlobals } from "@remix-run/node/globals";
import { prisma } from "~/db.server";

installGlobals();

async function deleteUser(id: number | undefined) {
  await prisma.user.delete({ where: { id } });
}

deleteUser(Number(process.argv[2]));