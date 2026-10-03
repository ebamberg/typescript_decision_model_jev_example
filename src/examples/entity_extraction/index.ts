
import { printAnswerCharts } from '../../decisions/answerCharts';
import { client } from '../../openrouter_client';
import { createInvoiceFromAnswers } from './model';
import { outputInvoice } from './output';


const example_doc = `Subject: Invoice INV-2026-1042 for order ORD-58319

Hello,

Please find the invoice for your recent order attached.

Invoice number: INV-2026-1042
Order number: ORD-58319
Order date: 2026-09-18
Total amount: €1,248.50
Bank account: DE89370400440532013000

If you have any questions, contact billing@example.com. You can also reach your account manager, Alex Morgan, at alex.morgan@example.com.

Best regards,
Example Supplies
accounts@example.com`;


const field_types = {
  money: /[$\u20AC£]\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g,
  id: /\b(?:INV|PO|REF|ORD|SO|CN|ACC|CASE|TKT|QUO)-[A-Z0-9][A-Z0-9-]*\b/g,
  email: /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g,
};

const fields = [
  { id: 'invoice_number', kind: 'id', description: 'invoice number of the invoice being sent' },
  { id: 'total_due', kind: 'money', description: 'total amount due on the new invoice' },
  { id: 'order_number', kind: 'id', description: 'purchase order reference for the new invoice' },
  { id: 'billing_email', kind: 'email', description: 'email address for billing questions' },
];

function extractCandidatesForFieldType(doc: string){
    const candidates =  Object.fromEntries(Object.entries(field_types).map(([kind,regex]) => 
        [ kind,Array.from(doc.matchAll(regex), match => match[0].trim()) ]
    ));
  return candidates;
}


export async function extractEntities() {

    const candidates=extractCandidatesForFieldType(example_doc);    

    const query = Object.fromEntries(fields.map(field => ([field.id, {
      type: 'score',
      instructions: field.description,
      criteria: (candidates[field.kind] || []).concat(['None of the above']),
    }])));

    const result = await client.systemOne({
        model: 'jev-latest',
        state: {
            description: 'A document to extract fields from. Judge only from the provided `document`..',
            document: example_doc,
        },
        questions: query,
    });
    printAnswerCharts(result.answers);
    outputInvoice(createInvoiceFromAnswers(result.answers));
}   



