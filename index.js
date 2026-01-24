export default {
  async fetch(request, env, ctx) {
    // Всегда отвечаем 200 Telegram'у
    const ok = () => new Response("ok");

    if (request.method !== "POST") return ok();

    try {
      const update = await request.json();

      const text = update?.message?.text;
      const chatId = update?.message?.chat?.id;

      if (text === "/start" && chatId) {
        // Проверим env (частая причина 500)
        if (!env?.BOT_TOKEN) throw new Error("BOT_TOKEN is missing");
        if (!env?.MINIAPP_URL) throw new Error("MINIAPP_URL is missing");

        const payload = {
          chat_id: chatId,
          text: "Добро пожаловать!",
          reply_markup: {
            inline_keyboard: [[
              { text: "Открыть мини-приложение", web_app: { url: env.MINIAPP_URL } }
            ]]
          }
        };

        // Отправку в Telegram делаем через waitUntil, чтобы ответить Telegram быстро
        ctx.waitUntil((async () => {
          const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const body = await r.text();
          if (!r.ok) console.error("Telegram sendMessage failed:", r.status, body);
        })());
      }

      return ok();
    } catch (e) {
      console.error("Worker error:", e?.stack || e);
      return ok(); // ключевой момент: наружу всё равно 200
    }
  },
};
