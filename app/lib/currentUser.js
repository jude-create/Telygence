import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress || `${userId}@clerk.local`;
  const name = clerkUser?.fullName || clerkUser?.firstName || null;

  const userByClerkId = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (userByClerkId) {
    return prisma.user.update({
      where: { id: userByClerkId.id },
      data: {
        email,
        name,
      },
    });
  }

  const userByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userByEmail) {
    return prisma.user.update({
      where: { id: userByEmail.id },
      data: {
        clerkId: userId,
        name,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId: userId,
      email,
      name,
    },
  });
}
