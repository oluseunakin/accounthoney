import type { User } from "@prisma/client";
import { prisma } from "~/db.server";
import { Buffer } from "buffer";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

/* export async function getUser(name: User["name"]) {
  return await prisma.user.findUnique({ where: { name } });
} */

export async function createUser(name: User["name"], password: string, type: User["type"]) {
  if(type === "customer") {
    return prisma.user.create({
      data: {
        name,
        type,
        password,
        customer: {
          create: {
            name: Buffer.from(name, "ascii").toString()
          }
        }
      }
    })
  }
  
  return prisma.user.create({
    data: {
      name,
      type,
      password,
    },
  });
}

/* export async function deleteUser(name: User["name"]) {
  return prisma.user.delete({ where: { name } });
} */

export async function verifyLogin(
  name: User["name"],
  password: User["password"]
) {
  
  const userWithPassword = await prisma.user.findUnique({
    where: {name_password: {
      name,
      password
    }},
  });

  if (!userWithPassword || typeof userWithPassword.password !== 'string') {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword
  return userWithoutPassword;
}

export async function createAnonymousUser() {
  
  return await prisma.user.findUnique({where: {
    name_password: {
      name: "Guest",
      password: "guest"
    }
  }})
}

export async function getAllUsers() {
  return await prisma.user.findMany()
}
