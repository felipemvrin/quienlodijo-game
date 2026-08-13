import type { Meta, StoryObj } from '@storybook/angular';
import { AnswerRevealComponent } from './answer-reveal.component';
import type { Character } from '../../../game/models/character.model';

const marx: Character = {
  id: 'marx',
  name: 'Karl Marx',
  description: 'Filósofo y economista alemán.',
  avatar: 'assets/characters/marx.svg',
  symbol: '☭',
  colorToken: 'marx',
};

const meta: Meta<AnswerRevealComponent> = {
  title: 'Juego/AnswerReveal',
  component: AnswerRevealComponent,
  args: { correct: true, character: marx, points: 140, timedOut: false },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<AnswerRevealComponent>;

export const Acierto: Story = {};

export const Fallo: Story = {
  args: { correct: false, points: 0 },
};

export const TiempoAgotado: Story = {
  args: { correct: false, points: 0, timedOut: true },
};
