"use server";
import prisma from "@/lib/prisma";
import { User } from "@/prisma_client/client";
import { currentUser } from "@clerk/nextjs/server";

export const createUser = async (): Promise<User | null> => {
  const user = await currentUser()

  if (!user) return null

  const getCurrentUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (getCurrentUser) return getCurrentUser

  const userCreated = await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName + " " + user.lastName,
      avatar: user.imageUrl,
    },
  })

  return userCreated;
};
