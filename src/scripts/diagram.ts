// Wires the Olympus Vision architecture diagram and the incident step.
// Both widgets are fully readable without JavaScript; this script only adds
// interaction. Every lookup is scoped to the widget's own root element.
const INTERACTIVE_CLASS = 'is-interactive';

function showNodeRole(detail: HTMLElement, name: string, role: string): void {
  const label = document.createElement('strong');
  label.textContent = `${name}: `;
  detail.replaceChildren(label, document.createTextNode(role));
}

function setupDiagram(root: HTMLElement): void {
  const detail = root.querySelector<HTMLElement>('#diagram-detail');
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-node]'));
  if (!detail || buttons.length === 0) return;

  // Node roles come from the rendered <dl>, so the copy lives in one place.
  const roleFor = (id: string): string =>
    root.querySelector<HTMLElement>(`[data-node-role="${id}"]`)?.textContent?.trim() ?? '';

  const select = (selected: HTMLButtonElement) => {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    const id = selected.dataset.node ?? '';
    const name = selected.querySelector('.diagram-node-name')?.textContent?.trim() ?? id;
    showNodeRole(detail, name, roleFor(id));
  };

  for (const button of buttons) {
    button.addEventListener('click', () => select(button));
  }
  detail.hidden = false;
  root.classList.add(INTERACTIVE_CLASS);
}

function setupIncident(root: HTMLElement): void {
  const details = root.querySelector<HTMLDetailsElement>('[data-incident-details]');
  const feedback = root.querySelector<HTMLElement>('[data-incident-feedback]');
  const radios = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
  if (!details || !feedback || radios.length === 0) return;

  const reveal = (choice: HTMLInputElement) => {
    const isCorrect = choice.dataset.correct === 'true';
    feedback.textContent =
      (isCorrect ? feedback.dataset.feedbackCorrect : feedback.dataset.feedbackWrong) ?? '';
    details.hidden = false;
    details.open = true;
  };

  for (const radio of radios) {
    radio.addEventListener('change', () => {
      if (radio.checked) reveal(radio);
    });
  }

  // Keep the fix back until the visitor has made a call, unless the browser
  // restored an earlier answer.
  const restored = radios.find((radio) => radio.checked);
  if (restored) reveal(restored);
  else details.hidden = true;
}

document.querySelectorAll<HTMLElement>('[data-diagram]').forEach(setupDiagram);
document.querySelectorAll<HTMLElement>('[data-incident]').forEach(setupIncident);
