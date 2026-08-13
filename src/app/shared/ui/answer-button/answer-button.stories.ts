import type { Meta, StoryObj } from '@storybook/angular';
import { AnswerButtonComponent } from './answer-button.component';
import type { Character } from '../../../game/models/character.model';

const jesus: Character = {
  id: 'jesus',
  name: 'Jesús',
  description: 'Predicador judío del siglo I.',
  avatar: 'assets/characters/jesus.svg',
  symbol: '✝️',
  colorToken: 'jesus',
};

const marx: Character = {
  id: 'marx',
  name: 'Karl Marx',
  description: 'Filósofo y economista alemán.',
  avatar: 'assets/characters/marx.svg',
  symbol: '☭',
  colorToken: 'marx',
};

const meta: Meta<AnswerButtonComponent> = {
  title: 'Juego/AnswerButton',
  component: AnswerButtonComponent,
  argTypes: {
    state: { control: 'inline-radio', options: ['idle', 'correct', 'incorrect', 'dimmed'] },
  },
  args: { character: jesus, state: 'idle', disabled: false },
};

export default meta;
type Story = StoryObj<AnswerButtonComponent>;

export const Jesus: Story = {};

export const Marx: Story = {
  args: { character: marx },
};

export const Correcta: Story = {
  args: { state: 'correct', disabled: true },
};

export const Incorrecta: Story = {
  args: { character: marx, state: 'incorrect', disabled: true },
};
