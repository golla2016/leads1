export default async function handler(req, res) {
  console.log("Received request:", req.method, req.body); // ✅ Debugging log
  if (req.method === "POST") {
    const {
      type,
      first_name,
      sur_name,
      phone,
      additionalComments,
      adultAges,
      childAges,
      adults,
      children,
      contact_method,
      email,
      total_members,
      cover_type,
      unique_id,
      agent_name,
    } = req.body;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    // 👇 decide heading based on type
    const heading =
      type === "agent" ? "New Agent Registration" : "New Form Submission";
    const text = `${heading}:\n\nName : ${first_name}\nSurname : ${sur_name}\nPhone : ${phone}\nAvaialble on : ${contact_method}\nEmail : ${email}\nCover Type : ${cover_type}\nTotal_Members : ${total_members}\nNumber of Adults : ${adults}\nNumber of Children : ${children}\nAdult Ages : ${adultAges.join(
      ", "
    )}\nChild Ages: ${childAges.join(
      ", "
    )}\nAdditional_Comments : ${additionalComments}\nUnique ID:${unique_id}\nAgent Name : ${agent_name} `;

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
