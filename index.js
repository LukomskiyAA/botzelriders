export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    const update = await request.json();

    if (update.message?.text === "/start") {
      const chatId = update.message.chat.id;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Добро пожаловать!",
          reply_markup: {
            inline_keyboard: [[
              {
                text: "Открыть мини-приложение",
                web_app: { url: MINIAPP_URL }
              }
            ]]
          }
        })
      });
    }

    return new Response("ok");
  }
};
