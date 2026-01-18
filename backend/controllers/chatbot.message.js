import user from "../models/user.model.js";
import bot from "../models/bot.model.js";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const message = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const userMessage = await user.create({
      sender: "user",
      text,
    });

    const botresponse = {
      hello: "Hello! How can I help you?",
      hii: "Hello! How can I help you?",
      thanks: "You're welcome!",
      goodbye: "Goodbye! Have a great day.",
    };

    const normalizedtext = text.toLowerCase().trim();

    let finalBotResponse;

    if (botresponse[normalizedtext]) {
      finalBotResponse = botresponse[normalizedtext];
    } else {
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: text },
          ],
        });

        finalBotResponse =
          completion.choices?.[0]?.message?.content ||
          "Sorry, I couldn't generate a response.";

      } catch (apiError) {
        console.error("Groq API error:", apiError.message);
        finalBotResponse = "Sorry, I couldn't reach the AI service.";
      }
    }

    if (!finalBotResponse?.trim()) {
      finalBotResponse = "I'm not sure how to respond to that.";
    }

    const botMessage = await bot.create({
      sender: "bot",
      text: finalBotResponse,
    });

    return res.status(200).json({
      usermsg: userMessage.text,
      botmsg: botMessage.text,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "internal server error" });
  }
};
