import { auth } from "./auth";
import { prisma } from "./prisma";

// Re-checks isAdmin directly against the database rather than trusting the
// session's JWT claim, since that claim only refreshes on sign-in.
export async function requireAdmin(): Promise<{ id: string } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!user?.isAdmin) return null;
  return { id: session.user.id };
}
