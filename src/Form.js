import { useState } from "react";

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/sendToTelegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Details sent to Telegram successfully! ✅");
      } else {
        alert("Failed to send message ❌");
      }
    } catch (error) {
      alert("Error sending details ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Enter Name"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Enter Phone"
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
