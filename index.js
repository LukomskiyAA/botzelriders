export default {
  async fetch(request, env, ctx) {
    const ok = () => new Response("ok", { status: 200 });
    if (request.method !== "POST") return ok();

    try {
      const update = await request.json();
      const msg = update?.message;
      if (!msg) return ok();

      const text = (msg.text || "").trim();
      const chatId = msg?.chat?.id;

      // /start или /start@botname
      const isStart = /^\/start(\s|@|$)/i.test(text);
      if (!isStart || !chatId) return ok();

      if (!env?.BOT_TOKEN) throw new Error("BOT_TOKEN is missing");
      if (!env?.MINIAPP_URL) throw new Error("MINIAPP_URL is missing");

      // Вариант 1 (самый простой): картинка по URL
      // Укажи ссылку на картинку в секрет PHOTO_URL
      const photo = env.PHOTO_URL || null;

      const caption =
`🏍️ Zel Riders приветствует тебя!

Для дальнейшего вступления в чат, необходимо перейти по кнопке ниже и заполнить анкету! 📝

P.S. Данная процедура является обязательной для вступления в чат!

Бот не передает анкету на сторонние ресурсы и не запоминает ее! 🛡️

Анкета составляется согласно шаблону и публикуется в чате, в разделе анкеты. 📍`;

      const reply_markup = {
        inline_keyboard: [[
          { text: "Заполнить анкету", web_app: { url: env.MINIAPP_URL } }
        ]]
      };

      // Отправляем либо фото+caption, либо просто сообщение
      ctx.waitUntil((async () => {
        if (photo) {
          const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              photo,
              caption,
              reply_markup
            }),
          });
          const body = await r.text();
          if (!r.ok) console.error("sendPhoto failed:", r.status, body);
        } else {
          const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: caption,
              reply_markup
            }),
          });
          const body = await r.text();
          if (!r.ok) console.error("sendMessage failed:", r.status, body);
        }
      })());

      return ok();
    } catch (e) {
      console.error("Worker error:", e?.stack || e);
      return ok(); // важно: Telegram всегда 200, чтобы не было ретраев
    }
  },
};
