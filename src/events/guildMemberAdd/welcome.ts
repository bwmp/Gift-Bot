import { AttachmentBuilder, Client, GuildMember, TextChannel } from "discord.js";
import Canvas from "@napi-rs/canvas";
import { formatOrdinalNumber, getSettings } from "~/functions/database";


Canvas.GlobalFonts.registerFromPath('./src/assets/fonts/NexaScript-Trial-Regular.ttf', 'NexaScript');

const applyText = (canvas: Canvas.Canvas, text: string) => {
  const context = canvas.getContext('2d');

  let fontSize = 70;

  do {
    context.font = `${fontSize -= 10}px NexaScript`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

export default async (client: Client, member: GuildMember) => {

  const settings = await getSettings(member.guild.id);

  const channel = member.guild.channels.cache.get(settings.joinmessage.channel) as TextChannel;

  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 315);
  const ctx = canvas.getContext("2d");

  const text = member.user.username

  ctx.fillStyle = settings.joinimage.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (settings.joinimage.image.startsWith("http")) {
    const cat = await Canvas.loadImage(settings.joinimage.image);

    ctx.drawImage(cat, 0, canvas.height - 100, 100, 100);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(cat, -700, canvas.height - 200, 200, 200);
    ctx.restore();
  }

  if (settings.joinimage.shadow === "true") {
    ctx.shadowColor = settings.joinimage.shadowColor;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  }

  ctx.font = "45px NexaScript";
  ctx.fillStyle = settings.joinimage.textColor;
  ctx.fillText("Welcome", canvas.width / 2.75, canvas.height / 2.25);
  ctx.font = applyText(canvas, text);
  ctx.fillStyle = settings.joinimage.textColor;
  ctx.fillText(text, canvas.width / 2.75, canvas.height / 1.5);

  ctx.shadowColor = "transparent";

  const pfp = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 }));

  ctx.beginPath();
  ctx.arc(125, canvas.height / 2, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(pfp, 25, canvas.height / 2 - 100, 200, 200);

  const attachment = new AttachmentBuilder(await canvas.encode("webp"), { name: "welcome.png" });

  const msg = settings.joinmessage.message
  .replace("{USER MENTION}", `<@${member.user.id}>`)
  .replace("{USERNAME}", member.user.username)
  .replace("{SERVER NAME}", member.guild.name)
  .replace("{NUMBER}", member.guild.memberCount.toString())
  .replace("{NUMBER FORMATTED}", formatOrdinalNumber(member.guild.memberCount))

  channel.send({ content: msg, files: [attachment] });

};