
import { email_triage } from './email_triage';
import { tool_approval } from './examples/steps_security_validation';


async function main() {
    console.log("Typescript example for Jev Decision Model");
    await email_triage();
    await tool_approval();
}

main();