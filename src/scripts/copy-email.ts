// Wires every copy-email widget on the page. Each widget is self-contained:
// all lookups are scoped to its own [data-copy-email-root] wrapper.
const STATUS_RESET_MS = 3000;

function isMacPlatform(): boolean {
  return /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
}

function selectText(element: Element): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

async function tryClipboardWrite(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function setupCopyEmail(root: HTMLElement): void {
  const button = root.querySelector<HTMLButtonElement>('[data-copy-email]');
  const emailText = root.querySelector<HTMLElement>('[data-email-text]');
  const status = root.querySelector<HTMLElement>('[role="status"]');
  if (!button || !emailText || !status) return;

  let resetTimer: number | undefined;
  const showStatus = (message: string) => {
    status.textContent = message;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      status.textContent = '';
    }, STATUS_RESET_MS);
  };

  button.addEventListener('click', async () => {
    const copied = await tryClipboardWrite(button.dataset.copyEmail ?? '');
    if (copied) {
      showStatus(status.dataset.copiedText ?? '');
      return;
    }
    // Clipboard unavailable or refused: select the address so the user can copy it by hand.
    selectText(emailText);
    const fallback = isMacPlatform() ? status.dataset.fallbackMac : status.dataset.fallbackOther;
    showStatus(fallback ?? '');
  });
}

document.querySelectorAll<HTMLElement>('[data-copy-email-root]').forEach(setupCopyEmail);
