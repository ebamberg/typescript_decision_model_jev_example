import { TypeSafeClient } from '@typesafe-ai/sdk';
import { printAnswerCharts } from './decisions/answerCharts.js';

const client = new TypeSafeClient({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api',
});


async function email_triage() {
    const result = await client.systemOne({
        model: 'jev-latest',
        state: 'I was charged twice for my subscription.',
        questions: {
            refund: { type: 'noul', instructions: 'Is the customer asking for money back?' },
            department: {
                type: 'choice',
                instructions: 'Which team should handle this?',
                criteria: { billing: 'Charges and refunds', technical: 'Bugs and outages' },
            },
            "angry": {
                "type": "score",
                "instructions": "How angry is the customer about this issue ?",
                "criteria": [
                    "Not angry",
                    "Slightly angry",
                    "Moderately angry",
                    "Very angry",
                    "Extremely angry"
                ]
            },
        },
    });

    printAnswerCharts(result.answers);
}

async function main() {
    console.log("Typescript example for Jev Decision Model");
    await email_triage();
}

main();