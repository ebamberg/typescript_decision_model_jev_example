import { printAnswerCharts } from '../decisions/answerCharts';
import { client } from '../openrouter_client';

export async function email_triage() {
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