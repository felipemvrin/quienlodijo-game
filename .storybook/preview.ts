import type { Preview } from '@storybook/angular';

// Los estilos globales llegan desde el `browserTarget` de angular.json (src/styles/global.css).
const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        stage: { name: 'Stage', value: '#120b1f' },
        surface: { name: 'Surface', value: '#1e1233' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
  initialGlobals: {
    backgrounds: { value: 'stage' },
  },
};

export default preview;
