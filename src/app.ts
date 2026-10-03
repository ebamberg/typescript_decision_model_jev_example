
import { email_triage } from './examples/email_triage';
import { tool_approval } from './examples/steps_security_validation';
import { extractEntities } from './examples/entity_extraction';
import { printExampleHeader } from './console_output';

async function main() {
    console.log("Typescript example for Jev Decision Model");
    printExampleHeader('Email Triage', 'Classifies an incoming email and recommends a handling path.');
    await email_triage();
    printExampleHeader('Tool Approval', 'Checks planned tool calls for destructive actions and required confirmation.');
    await tool_approval();
    printExampleHeader('Entity Extraction', 'Extracts invoice fields from a document and prints the resulting invoice.');
    await extractEntities();
}

main();

