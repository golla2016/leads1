export default async function handler(req, res) {
  console.log("Received request:", req.method, req.body); // ✅ Debugging log
  if (req.method === "POST") {
    const {
      name,
      phone,
      additionalComments,
      adultAges,
      childAges,
      adults,
      children,
      contactMethod,
      email,
      totalMembers,
    } = req.body;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const text = `New Form Submission:\n\nName: ${name}\nPhone: ${phone}\nAvaialble on:${contactMethod}\nEmail:${email}\Total_Members:${totalMembers}\nNumber of Adults:${adults}\nNumber of Children:${children}\nAdult Ages: ${adultAges.join(
      ", "
    )}\nChild Ages: ${childAges.join(
      ", "
    )}\nAdditional_Comments: ${additionalComments}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Failed to send message" });
    }
  }

  res.status(400).json({ error: "Invalid request" });
}
