# TypeScript Jev Example

Minimal TypeScript example for sending a request to the `jev-latest` model through OpenRouter and displaying its answers as console charts.

## Requirements

- Node.js 20 or newer
- An OpenRouter API key with access to `jev-latest`

## Run

After checking out the repository, run these commands from its root:

```sh
npm ci
```

Set `OPENROUTER_API_KEY` in the same terminal session. For PowerShell:

```powershell
$env:OPENROUTER_API_KEY = "your-api-key"
```

For Command Prompt:

```cmd
set OPENROUTER_API_KEY=your-api-key
```

Start the example:

```sh
npm start
```

To compile the TypeScript source, run `npm run build`.

## Examples

The project includes a few small decision-model examples:

- `email_triage`: classify an incoming email and recommend the right handling path.
- `tool_approval`: judge planned tool calls such as `read_doc` and `bash` to decide whether they are destructive or need confirmation before execution.

The app entry point in `src/app.ts` runs both examples in sequence when you start the project.

## Example Output

Synthetic chart output for yes/no, choice, and score answers. The choice example shows two close probabilities highlighted in red.

![Terminal output with probability charts for refund, department, and score answers](docs/answer-charts.svg)