export interface InvoiceFields {
  invoice_number: string | null;
  total_due: string | null;
  order_number: string | null;
  billing_email: string | null;
}

export class Invoice implements InvoiceFields {
  readonly invoice_number: string | null;
  readonly total_due: string | null;
  readonly order_number: string | null;
  readonly billing_email: string | null;

  constructor(fields: InvoiceFields) {
    this.invoice_number = fields.invoice_number;
    this.total_due = fields.total_due;
    this.order_number = fields.order_number;
    this.billing_email = fields.billing_email;
  }
}

function highestProbabilityCandidate(answer: unknown): string | null {
  if (
    typeof answer !== 'object' || answer === null ||
    !('type' in answer) || answer.type !== 'score' ||
    !('confidence' in answer) || typeof answer.confidence !== 'number' ||
    !('probabilities' in answer) || typeof answer.probabilities !== 'object' || answer.probabilities === null ||
    !('legend' in answer) || typeof answer.legend !== 'object' || answer.legend === null
  ) {
    return null;
  }

  const probabilities = answer.probabilities as Record<string, unknown>;
  const legend = answer.legend as Record<string, unknown>;
  const bestScore = Object.entries(probabilities).reduce<[string, number]>(
    (best, [score, probability]) => typeof probability === 'number' && probability > best[1]
      ? [score, probability]
      : best,
    ['', -Infinity],
  );
  const candidate = legend[bestScore[0]];

  if (typeof candidate !== 'string' || candidate === 'None of the above') {
    return null;
  }

  return answer.confidence < 0.6 ? 'inconfident' : candidate;
}

export function createInvoiceFromAnswers(answers: Record<string, unknown>): Invoice {
  return new Invoice({
    invoice_number: highestProbabilityCandidate(answers.invoice_number),
    total_due: highestProbabilityCandidate(answers.total_due),
    order_number: highestProbabilityCandidate(answers.order_number),
    billing_email: highestProbabilityCandidate(answers.billing_email),
  });
}