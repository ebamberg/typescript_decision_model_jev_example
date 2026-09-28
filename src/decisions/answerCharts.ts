type JevAnswer =
    | { type: 'noul'; noul: number }
    | {
            type: 'choice';
            choice: string;
            probabilities: Record<string, number>;
            confidence?: number;
        }
        | {
            type: 'score';
            score: number;
            confidence: number;
            legend: Record<string, unknown>;
            probabilities: Record<string, number>;
        };

export function printAnswerCharts(answers: Record<string, JevAnswer>) {
    const barWidth = 24;
    const useColor = Boolean(process.stdout.isTTY);
    const green = '\x1b[32m';
    const red = '\x1b[1;31m';
    const gray = '\x1b[90m';
    const titleStyle = useColor ? '\x1b[1;36m' : '';
    const reset = '\x1b[0m';

    for (const [question, answer] of Object.entries(answers)) {
        let values: Array<[string, number]>;
        let details = '';

        if (answer.type === 'noul') {
            const trueProbability = Math.max(0, Math.min(1, answer.noul));
            const falseProbability = 1 - trueProbability;
            const trueIsHigher = trueProbability >= falseProbability;
            const falseColor = useColor && !trueIsHigher ? green : useColor ? gray : '';
            const trueColor = useColor && trueIsHigher ? green : useColor ? gray : '';
            const falseClear = falseColor ? reset : '';
            const trueClear = trueColor ? reset : '';
            const switchTrack = trueIsHigher ? '[────●]' : '[●────]';

            console.log(
                `  ${falseColor}FALSE ${(falseProbability * 100).toFixed(1)}%${falseClear}  ${switchTrack}  ${trueColor}TRUE ${(trueProbability * 100).toFixed(1)}%${trueClear}`,
            );
            continue;
        } else if (answer.type === 'choice') {
            values = Object.entries(answer.probabilities);
            details = ` (selected: ${answer.choice}${answer.confidence === undefined ? '' : `, confidence: ${(answer.confidence * 100).toFixed(0)}%`})`;
        } else {
            values = Object.entries(answer.probabilities).map(([score, probability]) => {
                const criterion = answer.legend[score];
                const description = typeof criterion === 'string' ? criterion : JSON.stringify(criterion);
                return [description ? `${score}: ${description}` : score, probability];
            });
            details = ` (score: ${answer.score.toFixed(2)}, confidence: ${(answer.confidence * 100).toFixed(0)}%)`;
        }

        const rankedValues = [...values].sort((left, right) => right[1] - left[1]);
        const highest = rankedValues[0]?.[1] ?? 0;
        const closeTopTwo = rankedValues.length > 1
            && highest - rankedValues[1][1] <= 0.1;
        const closeLabels = new Set(closeTopTwo ? rankedValues.slice(0, 2).map(([label]) => label) : []);
        if (closeTopTwo) {
            details = details
                ? `${details.slice(0, -1)}, close top probabilities)`
                : ' (close top probabilities)';
        }
        console.log(`${titleStyle}${question}${titleStyle ? reset : ''}${details}`);

        for (const [label, probability] of values) {
            const percentage = Math.max(0, Math.min(1, probability));
            const filled = Math.round(percentage * barWidth);
            const bar = `${'█'.repeat(filled)}${'-'.repeat(barWidth - filled)}`;
            const isHighest = probability === highest;
            const color = useColor
                ? closeLabels.has(label)
                    ? red
                    : isHighest
                        ? green
                        : gray
                : '';
            const clear = color ? reset : '';
            console.log(`  ${color}${label.padEnd(12)} [${bar}] ${(percentage * 100).toFixed(1)}%${clear}`);
        }
    }
}