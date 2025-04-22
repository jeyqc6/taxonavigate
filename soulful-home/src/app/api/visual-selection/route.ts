import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Selection {
  optionId: string;
  tags: {
    style: string[];
    personality: string[];
    emotional: string[];
  };
}

interface Selections {
  [key: string]: Selection;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, optionId, tags } = body;

    // Define the path to save the file
    const filePath = path.join(process.cwd(), 'public', 'selections.json');
    
    // Create the public directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Read existing selections if file exists
    let selections: Selections = {};
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      selections = JSON.parse(fileContent);
    }

    // Update selections with new choice
    selections[questionId] = {
      optionId,
      tags
    };

    // Save all selections to the file
    fs.writeFileSync(filePath, JSON.stringify(selections, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing visual selection:', error);
    return NextResponse.json(
      { error: 'Failed to process selection' },
      { status: 500 }
    );
  }
} 