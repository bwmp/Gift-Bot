import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
logger.info("Prisma client initialized");

export async function addLicenseKey(
    userId: string,
    licenseKey: string,
    product: string
) {

    const result = await prisma.licenses.upsert({
        where: {
            license_key: licenseKey,
        },
        create: {
            license_key: licenseKey,
            product: product,
            userId: userId,
        },
        update: {},
    });

    await prisma.$disconnect();

    return result ? true : false;
}

export async function deleteLicenseKey(licenseKey: string) {
    prisma.licenses.delete({
        where: {
            license_key: licenseKey,
        },
    });
    prisma.$disconnect();
}

export async function addXp(userId: string, xp: number) {
    const result = { leveledUp: false, newLevel: 0 };

    await prisma.$transaction(async (tx) => {
        let user = await tx.levels.upsert({
            where: {
                userId: userId,
            },
            create: {
                userId: userId,
                xp: xp,
                level: 1,
            },
            update: {
                xp: {
                    increment: xp,
                },
            },
        });

        const newXp = user.xp + xp;

        if (newXp >= user.xp_needed) {
            const newLevel = user.level + 1;
            const newXpNeeded = calculateXpNeeded(newLevel);
            await tx.levels.update({
                where: {
                    userId: userId,
                },
                data: {
                    xp: 0,
                    level: newLevel,
                    xp_needed: newXpNeeded,
                },
            });

            result.leveledUp = true;
            result.newLevel = newLevel;
        }
    });

    await prisma.$disconnect();
    return result;
}

export async function getXp(userId: string) {
    const user = await prisma.levels.upsert({
        where: {
            userId: userId,
        },
        create: {
            userId: userId,
        },
        update: {},
    });

    await prisma.$disconnect();
    return user;
}

export async function getTopUsers(limit: number) {
    const users = await prisma.levels.findMany({
        orderBy: {
            xp: "desc",
        },
        take: limit,
    });
    prisma.$disconnect();
    return users;
}

function calculateXpNeeded(level: number) {
    return Math.floor(Math.pow(level / 0.015, 1));
}


export default prisma;