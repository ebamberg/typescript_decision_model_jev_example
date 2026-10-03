export function printExampleHeader(title: string, description: string) {
    const useColor = Boolean(process.stdout.isTTY);
    const titleStyle = useColor ? '\x1b[1;30;46m' : '';
    const ruleStyle = useColor ? '\x1b[1;36m' : '';
    const reset = useColor ? '\x1b[0m' : '';
    const rule = '='.repeat(72);

    console.log(`\n${ruleStyle}${rule}${reset}`);
    console.log(`${titleStyle}  ${title.toUpperCase()}  ${reset}`);
    console.log(description);
    console.log(`${ruleStyle}${rule}${reset}\n`);
}