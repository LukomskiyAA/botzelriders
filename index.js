export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("OK");

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400 });
    }

    const text = update?.message?.text;
    const chatId = update?.message?.chat?.id;

    if (text === "/start" && chatId) {
      const payload = {
        chat_id: chatId,
        text: "Добро пожаловать!",
        reply_markup: {
          inline_keyboard: [[
            { text: "Открыть мини-приложение", web_app: { url: env.MINIAPP_URL } }
          ]]
        }
      };

      const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Если Telegram вернул ошибку — покажем её в ответе (удобно для отладки)
      if (!tgRes.ok) {
        const t = await tgRes.text();
        return new Response(`Telegram error: ${t}`, { status: 502 });
      }
    }

    return new Response("ok");
  },
};
