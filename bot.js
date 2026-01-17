const { Bot, InlineKeyboard } = require("grammy");
const http = require("http");

// Токен вашего бота от @BotFather
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

// Запуск бота
bot.start();

// Хелс-чек сервер для хостингов (Koyeb, Render и др.)
// Это предотвратит ошибку "Build Failed" или "Port not found"
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
}).listen(process.env.PORT || 8080);

console.log("Бот Zel Riders успешно запущен...");
