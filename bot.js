const { Bot, InlineKeyboard } = require("grammy");
const http = require("http");

// Токен бота: 8394525518:AAF5RD0yvNLZQjiTS3wN61cC3K2HbNwJtxg
const bot = new Bot("8394525518:AAF5RD0yvNLZQjiTS3wN61cC3K2HbNwJtxg");

bot.command("start", async (ctx) => {
  // Кнопка Mini App (webApp) вместо обычной ссылки (url)
  const keyboard = new InlineKeyboard().webApp(
    "Заполнить анкету",
    "https://zel-riders-miniapp.vercel.app/"
  );

  await ctx.replyWithPhoto(
    "https://i.ibb.co/6RL2S1rv/nakleika.png",
    {
      caption: `Zel Riders приветствует тебя!

Для дальнейшего вступления в чат, необходимо перейти по кнопке ниже и заполнить анкету!`,
      reply_markup: keyboard,
    }
  );
});

bot.start();

// Health check для Koyeb (обязателен)
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running");
}).listen(PORT, "0.0.0.0");
