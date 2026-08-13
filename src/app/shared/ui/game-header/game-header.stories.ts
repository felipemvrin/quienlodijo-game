import type { Meta, StoryObj } from '@storybook/angular';
import { GameHeaderComponent } from './game-header.component';

const meta: Meta<GameHeaderComponent> = {
  title: 'Juego/GameHeader',
  component: GameHeaderComponent,
  args: { round: 2, totalRounds: 5, currentPlayerName: 'Marta', muted: false },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<GameHeaderComponent>;

export const Default: Story = {};

export const Silenciado: Story = {
  args: { muted: true },
};
