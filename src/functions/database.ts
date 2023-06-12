import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";
import { join_leaveMessage, joinleaveImage, ticketdata } from "~/interfaces/database";

const prisma = new PrismaClient();
logger.info("Prisma client initialized");

export async function getSettings(guildId: string) {
    const settings = await prisma.settings.upsert({
        where: {
            guildId: guildId,
        },
        create: {
            guildId: guildId,
        },
        update: {},
    });

    const joinmessage = JSON.parse(settings.joinmessage || '{}') as join_leaveMessage;
    const joinimage = JSON.parse(settings.joinimage || '{}') as joinleaveImage;
    const leavemessage = JSON.parse(settings.leavemessage || '{}') as join_leaveMessage;
    const leaveimage = JSON.parse(settings.leaveimage || '{}') as joinleaveImage;
    const ticketdata = JSON.parse(settings.ticketdata || '{}') as ticketdata;
    const membercountchannel = settings.membercountchannel
    const wishlistchannel = settings.wishlistchannel
    const ticketId = settings.ticketId

    return { joinmessage, joinimage, leavemessage, leaveimage, ticketdata, membercountchannel, wishlistchannel, ticketId };
}

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

    return result ? true : false;
}

export async function deleteLicenseKey(licenseKey: string) {
    prisma.licenses.delete({
        where: {
            license_key: licenseKey,
        },
    });
}

export async function addXp(member: User, guildId: string, xp: number) {
    const result = { leveledUp: false, newLevel: 0 };

    await prisma.$transaction(async (tx) => {
        let user = await tx.levels.upsert({
            where: {
                userId_guildId: {
                    userId: member.id,
                    guildId: guildId,
                },
            },
            create: {
                guildId: guildId,
                userId: member.id,
                username: member.username,
                xp: xp,
                level: 1,
            },
            update: {
                xp: {
                    increment: xp,
                },
                username: member.username,
            },
        });

        const newXp = user.xp + xp;

        if (newXp >= user.xp_needed) {
            const newLevel = user.level + 1;
            const newXpNeeded = calculateXpNeeded(newLevel);
            await tx.levels.update({
                where: {
                    userId_guildId: {
                        userId: member.id,
                        guildId: guildId,
                    },
                },
                data: {
                    xp: 0,
                    level: newLevel,
                    xp_needed: newXpNeeded,
                    username: member.username,
                },
            });

            result.leveledUp = true;
            result.newLevel = newLevel;
        }
    });

    return result;
}

export async function getXp(userId: string, guildId: string) {
    const user = await prisma.levels.upsert({
        where: {
            userId_guildId: {
                userId: userId,
                guildId: guildId,
            },
        },
        create: {
            userId: userId,
            guildId: guildId,
        },
        update: {},
    });

    return user;
}

export async function getTopUsers(guildId: string, limit: number) {
    const users = await prisma.levels.findMany({
        where: {
            guildId: guildId,
        },
        orderBy: {
            xp: "desc",
        },
        take: limit,
    });

    return users;
}

function calculateXpNeeded(level: number) {
    return Math.floor(Math.pow(level / 0.015, 1));
}

export function formatOrdinalNumber(number: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    // If the remainder is between 11 and 13, use "th" suffix
    if (remainder >= 11 && remainder <= 13) {
        return number + "th";
    }

    // Otherwise, use the appropriate suffix based on the last digit
    const lastDigit = number % 10;
    return number + (suffixes[lastDigit] || "th");
}

export default prisma;