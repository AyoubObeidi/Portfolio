"use server";

import { parseContact } from "@/lib/contact";

export type SendResult = { ok: true } | { ok: false };

// Sends a contact-chat message to my Telegram through a bot (no email domain needed).
// Plain text on purpose: Telegram makes the visitor's email tappable, and nothing needs escaping.
export async function sendContactMessage(input: unknown): Promise<SendResult> {
  const message = parseContact(input);
  if (!message) return { ok: false };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Contact form: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
    return { ok: false };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: [
            `${message.topic}: ${message.name}`,
            message.email,
            "",
            message.message,
          ].join("\n"),
          link_preview_options: { is_disabled: true },
        }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      // Telegram's error body never contains the token, so it's safe to log.
      console.error(
        `Contact form: Telegram responded ${response.status}`,
        await response.text(),
      );
      return { ok: false };
    }
    return { ok: true };
  } catch {
    // The error could include the request URL, which contains the token, so don't log it.
    console.error("Contact form: request to Telegram failed.");
    return { ok: false };
  }
}
