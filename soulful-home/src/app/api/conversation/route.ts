import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, currentQuestion } = body;

    // Read the selections file to get user's preferences
    const selectionsPath = path.join(process.cwd(), 'public', 'selections.json');
    let selections = {};
    if (fs.existsSync(selectionsPath)) {
      const fileContent = fs.readFileSync(selectionsPath, 'utf-8');
      selections = JSON.parse(fileContent);
    }

    // Create system message based on user's selections and current question
    const systemMessage = {
      role: 'system',
      content: `You are a home design assistant conducting a structured interview. The user has made the following selections:
      ${Object.entries(selections).map(([questionId, selection]: [string, any]) => 
        `Question ${questionId}: ${selection.tags.style.join(', ')} style, ${selection.tags.personality.join(', ')} personality, ${selection.tags.emotional.join(', ')} emotional preference`
      ).join('\n')}
      
      Current question: ${currentQuestion}
      
      Please provide a brief, focused response (2-3 sentences) that acknowledges the user's answer and connects it to their design preferences. Keep it conversational and concise.`
    };

    // Add system message to the conversation
    const conversation = [systemMessage, ...messages];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      temperature: 0.7,
      max_tokens: 150, // Limit response length
    });

    // Save conversation data for report generation
    const conversationPath = path.join(process.cwd(), 'public', 'conversation.json');
    const conversationData = {
      timestamp: new Date().toISOString(),
      question: currentQuestion,
      userResponse: messages[messages.length - 1].content,
      aiResponse: completion.choices[0].message.content
    };

    // check if the current question is the first one
    const isFirstQuestion = currentQuestion === "If anything were possible, what would your dream home look like?";
    
    let conversations = [];
    if (!isFirstQuestion && fs.existsSync(conversationPath)) {
      // if not the first question, read existing conversations
      const fileContent = fs.readFileSync(conversationPath, 'utf-8');
      conversations = JSON.parse(fileContent);
    }

    // Add the new conversation data
    conversations.push(conversationData);

    // Write the updated conversations back to the file
    fs.writeFileSync(conversationPath, JSON.stringify(conversations, null, 2));

    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in conversation API:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation message' },
      { status: 500 }
    );
  }
} 