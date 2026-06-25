import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // 1. Keep the command that forces VS Code to talk to macOS
  const openCommand = vscode.commands.registerCommand(
    "localizator.openApp",
    async (filePath: string, key: string, keyPrefix: string) => {
      const systemUrl = `localizator://open?file=${encodeURIComponent(filePath)}&key=${encodeURIComponent(key)}&prefix=${encodeURIComponent(keyPrefix)}`;

      // Forces VS Code to pass the deep link to the OS layer
      await vscode.env.openExternal(vscode.Uri.parse(systemUrl));
    },
  );

  // 2. Register the DocumentLink Provider
  const linkProvider = vscode.languages.registerDocumentLinkProvider(
    ["javascript", "typescript", "javascriptreact", "typescriptreact"],
    {
      provideDocumentLinks(document: vscode.TextDocument) {
        const links: vscode.DocumentLink[] = [];
        const text = document.getText();

        // Find the keyPrefix if it exists in this file
        const prefixRegex =
          /useTranslation\([^,]*,\s*{\s*keyPrefix:\s*["']([^"']+)["']/;
        const prefixMatch = prefixRegex.exec(text);
        const keyPrefix = prefixMatch ? prefixMatch[1] : "";

        // Find all t("key") instances
        const tRegex = /t\(["']([^"']+)["']\)/g;
        let match;

        while ((match = tRegex.exec(text)) !== null) {
          const key = match[1];
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          const filePath = document.uri.fsPath;

          // Encode arguments for the internal command URI
          const args = encodeURIComponent(
            JSON.stringify([filePath, key, keyPrefix]),
          );

          // Format as a VS Code command link instead of a raw deep link
          const commandUri = vscode.Uri.parse(
            `command:localizator.openApp?${args}`,
          );

          const documentLink = new vscode.DocumentLink(range, commandUri);
          documentLink.tooltip = `Cmd+Click to open '${key}' in Localizator App`;

          links.push(documentLink);
        }

        return links;
      },
    },
  );

  context.subscriptions.push(openCommand, linkProvider);
}
