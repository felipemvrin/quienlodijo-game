import type { Meta, StoryObj } from '@storybook/angular';
import { PlayerCardComponent } from './player-card.component';

const meta: Meta<PlayerCardComponent> = {
  title: 'Juego/PlayerCard',
  component: PlayerCardComponent,
  args: {
    player: { id: 'p1', name: 'Marta', avatarId: 'avatar-corona', score: 250 },
    avatarImage: '👑',
    avatarColor: '#ffcf3f',
    active: false,
    position: null,
  },
};

export default meta;
type Story = StoryObj<PlayerCardComponent>;

export const Default: Story = {};

export const EnTurno: Story = {
  args: { active: true },
};

export const EnClasificacion: Story = {
  args: { position: 1, player: { id: 'p2', name: 'Julián', avatarId: 'avatar-rayo', score: 480 } },
};
