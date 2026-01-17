const { Bot, InlineKeyboard } = require("grammy");
const http = require("http");

/**
 * Бот для Zel Riders
 * Токен: 8394525518:AAF5RD0yvNLZQjiTS3wN61cC3K2HbNwJtxg
 */
const bot = new Bot("8394525518:AAF5RD0yvNLZQjiTS3wN61cC3K2HbNwJtxg");

bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().url(
    "Заполнить анкету",
    "https://zel-riders-miniapp.vercel.app/"
  );

  await ctx.replyWithPhoto(
    "https://i.ibb.co/6RL2S1rv/nakleika.png",
    {
      caption: `Zel RIders приветствует тебя!

Для дальнейшего вступления в чат, необходимо перейти по кнопке ниже и заполнить анкету!`,
      reply_markup: keyboard,
    }
  );
});

bot.start();

// Порт для Koyeb/Render (обязательно для прохождения билда)
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is alive!");
}).listen(PORT, "0.0.0.0", () => {
  console.log("Сервер проверки запущен на порту " + PORT);
});
