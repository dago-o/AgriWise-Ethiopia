import {
  askAgricultureAIService,
} from "../services/aiService.js";

export const askAgricultureAI = async (req, res) => {
  try {
    const { cropId, question } = req.body;

    if (!cropId) {
      return res.status(400).json({
        message: "cropId is required",
      });
    }

    if (
      !question ||
      typeof question !== "string" ||
      question.trim() === ""
    ) {
      return res.status(400).json({
        message: "Question is required and must be a string",
      });
    }

    const result = await askAgricultureAIService(
      cropId,
      question,
      req.user.id
    );

    res.status(200).json({
      message: "AI response generated successfully",
      result,
    });
  } catch (error) {
    console.error("AI agriculture error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};