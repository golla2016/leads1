export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, phone, message } = req.body; // Get form data

  const TELEGRAM_BOT_TOKEN = "7775220900:AAGcIOUFqkqa_g0_majc_4QOhP-N_zDdl1U"; // Replace with your bot token
  const TELEGRAM_CHAT_ID = "5507377846"; // Replace with your chat ID

  const text = `📩 New Form Submission:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n💬 Message: ${message}`;

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram");
    }

    return res
      .status(200)
      .json({ success: true, message: "Sent to Telegram!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
}
