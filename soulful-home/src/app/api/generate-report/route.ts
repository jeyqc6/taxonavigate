import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { generateUserReports } from '@/lib/persona_generator';
import { performSemanticSearch } from '@/lib/semantic_search';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log('Starting report generation...');
    
    // Read conversation and selections data
    const conversationPath = path.join(process.cwd(), 'public', 'conversation.json');
    const selectionsPath = path.join(process.cwd(), 'public', 'selections.json');
    
    console.log('Reading conversation and selections files...');
    let conversation = [];
    let selections = {};
    
    if (fs.existsSync(conversationPath)) {
      const fileContent = fs.readFileSync(conversationPath, 'utf-8');
      conversation = JSON.parse(fileContent);
      console.log('Conversation data loaded:', conversation.length, 'entries');
    } else {
      console.error('Conversation file not found:', conversationPath);
    }
    
    if (fs.existsSync(selectionsPath)) {
      const fileContent = fs.readFileSync(selectionsPath, 'utf-8');
      selections = JSON.parse(fileContent);
      console.log('Selections data loaded:', Object.keys(selections).length, 'entries');
    } else {
      console.error('Selections file not found:', selectionsPath);
    }

    // Generate user reports
    console.log('Generating user reports...');
    const userReports = await generateUserReports(conversation, selections);
    console.log('User reports generated successfully');

    // Perform semantic search based on the reports
    console.log('Performing semantic search...');
    const searchResults = await performSemanticSearch(userReports);
    console.log('Semantic search completed');

    // Save the results
    const resultsPath = path.join(process.cwd(), 'public', 'report_results.json');
    console.log('Saving results to:', resultsPath);
    fs.writeFileSync(resultsPath, JSON.stringify({
      userReports,
      searchResults
    }, null, 2));

    return NextResponse.json({
      success: true,
      userReports,
      searchResults
    });
  } catch (error) {
    console.error('Error in generate-report API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 