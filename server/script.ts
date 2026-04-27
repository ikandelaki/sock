import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Irakli",
      email: "iraklikandelaki2@gmail.com",
      password: "#Tester123",
    },
  });

  console.log(">> created user:", user);

  const allUsers = await prisma.user.findMany({
    include: {
      sentMessages: true,
      receivedMessages: true,
    },
  });
  console.log(">> all users:", allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
