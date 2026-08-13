import type { Meta, StoryObj } from '@storybook/angular';
import { ScoreBadgeComponent } from './score-badge.component';

const meta: Meta<ScoreBadgeComponent> = {
  title: 'UI/ScoreBadge',
  component: ScoreBadgeComponent,
  args: { score: 320, highlight: false },
};

export default meta;
type Story = StoryObj<ScoreBadgeComponent>;

export const Default: Story = {};

export const Destacado: Story = {
  args: { highlight: true },
};
