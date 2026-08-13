import type { Meta, StoryObj } from '@storybook/angular';
import { TimerComponent } from './timer.component';

const meta: Meta<TimerComponent> = {
  title: 'Juego/Timer',
  component: TimerComponent,
  args: { remainingMs: 8000, totalMs: 10000, dangerThresholdSeconds: 3 },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<TimerComponent>;

export const Default: Story = {};

export const CasiAgotado: Story = {
  args: { remainingMs: 2000 },
};
