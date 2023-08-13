import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
logger.info("Prisma client initialized");

interface ClaimGiftResponse {
  message: string;
  code: string | null;
}

export async function claimGift(userId: string, product: string, skipCheck?: boolean): Promise<ClaimGiftResponse> {
  if (!skipCheck) {
    const claimedcode = await prisma.usedCodes.findFirst({
      where: {
        userId,
        product,
      }
    });
    if (claimedcode) return { message: "You have already claimed this gift", code: null };
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const codeExists = await prisma.usedCodes.findFirst({
    where: {
      code,
    }
  });

  if (codeExists) return claimGift(userId, product, true);
  const apiUrl = `https://api.gumroad.com/v2/products/${product}/offer_codes`;

  const requestData = new URLSearchParams();
  requestData.append('access_token', process.env.GUMROAD_API_KEY!);
  requestData.append('name', code);
  requestData.append('amount_off', '100');
  requestData.append('offer_type', 'percent');
  requestData.append('max_purchase_count', '1');

  const resp = fetch(apiUrl, {
    method: 'POST',
    body: requestData,
  })
    .then((res) => res.json())
    .then(async (json) => {
      if (json.success) {
        await prisma.usedCodes.create({
          data: {
            userId,
            product,
            code
          }
        });
        return { message: "Successfully claimed gift. Your code is: ", code };
      } else {
        logger.error(json);
        return { message: "Failed to claim gift", code: null };
      }
    });
  return resp;
}

export default prisma;