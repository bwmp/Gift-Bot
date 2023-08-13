import { Command } from '~/types/objects';
import opts from '~/options/checkcode'
import prisma from '~/functions/database';
export const removecode: Command = {
  description: "removes a code from the database and attempts to remove it from gumroad",
  permissions: ['Administrator'],
  options: opts,
  ephemeral: true,
  execute: async function (interaction, args) {
    const code = args.getString('code', true);

    const codeExists = await prisma.usedCodes.findFirst({
      where: {
        code,
      }
    });

    if (!codeExists) {
      interaction.editReply({ content: "Code not found" });
      return;
    }

    await prisma.usedCodes.delete({
      where: {
        userId_product: {
          userId: codeExists.userId,
          product: codeExists.product,
        }
      }
    });

    const apiUrl = `https://api.gumroad.com/v2/products/${codeExists.product}/offer_codes/${code}`;

    const requestData = new URLSearchParams();
    requestData.append('access_token', process.env.GUMROAD_API_KEY!);
    console.log(apiUrl)
    fetch(apiUrl, {
      method: 'DELETE',
      body: requestData,
    }).then(res => res.json()).then(res => {
      console.log(res)
      if(!res.success){
        interaction.editReply({ content: `Code: ${code} removed for user: <@${codeExists.userId}> (${codeExists.userId})\nFailed to remove code from gumroad` });
        return;
      }
    }).catch((e) => {
      console.log(e);
    });

    interaction.editReply({ content: `Code: ${code} removed for user: <@${codeExists.userId}> (${codeExists.userId})` });

  }
}