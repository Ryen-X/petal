import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful assistant for the PETAL application, which tracks and forecasts plant bloom intensity based on NDVI data. Your purpose is to answer questions related to plant blooms, NDVI, forecasting, and the PETAL application itself. Do not answer questions outside of this scope." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ response: text });
  } catch (e: unknown) {
    console.error("Error in chatbot API:", e);
    let errorMessage = "Failed to get response from chatbot";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
