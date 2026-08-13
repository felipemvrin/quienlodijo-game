import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
  component: ButtonComponent,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Comenzar</app-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'lg', disabled: false },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', disabled: false },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md', disabled: false },
};

export const Disabled: Story = {
  args: { variant: 'primary', size: 'md', disabled: true },
};
