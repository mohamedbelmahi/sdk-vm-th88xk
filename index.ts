import sdk, { Project, VM } from '@stackblitz/sdk';

import './styles.css';

let vm: VM | null = null;

const project: Project = {
  title: 'Dynamically Generated Project',
  description: 'Created with <3 by the StackBlitz SDK!',
  template: 'javascript',
  files: {
    'index.html': `<h1>SDK generated project</h1>`,
    'index.js': '// Hello there!',
  },
  settings: {
    compile: { clearConsole: false },
  },
};

async function embedNewProject() {
  vm = await sdk.embedProject('embed', project, {
    openFile: 'index.html',
    view: 'editor',
  });

  // Enable buttons that require the VM
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    'button:disabled'
  )) {
    button.disabled = false;
  }
}

async function openFiles() {
  if (!vm) {
    console.error('SDK vm is not available');
    return;
  }

  await vm.editor.openFile(['index.html', 'index.js']);
}

async function writeToFiles() {
  if (!vm) {
    console.error('SDK vm is not available');
    return;
  }

  const files = await vm.getFsSnapshot();
  const html = files ? files['index.html'] : '';
  const js = files ? files['index.js'] : '';
  const time = new Date().toTimeString();

  await vm.applyFsDiff({
    create: {
      'index.html': `${html}\n<!-- New random content at ${time} -->`,
      'index.js': `${js}\n// Random content at ${time}`,
    },
    destroy: [],
  });
}

(window as any).demo = {
  embedNewProject,
  openFiles,
  writeToFiles,
};
