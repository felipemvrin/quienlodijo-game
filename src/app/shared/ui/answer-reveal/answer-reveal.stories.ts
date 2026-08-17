import type { Meta, StoryObj } from '@storybook/angular';
import { AnswerRevealComponent } from './answer-reveal.component';
import type { Character } from '../../../game/models/character.model';
import type { Question } from '../../../game/models/question.model';

const marx: Character = {
  id: 'marx',
  name: 'Karl Marx',
  description: 'Filósofo y economista alemán.',
  avatar: 'assets/characters/marx.svg',
  symbol: '☭',
  colorToken: 'marx',
};

const question: Question = {
  id: 'q-marx-solido-aire',
  quote: 'Todo lo sólido se desvanece en el aire, todo lo sagrado es profanado.',
  correctAnswer: 'marx',
  explanation:
    'Descripción del vértigo que la burguesía imprime a la vida moderna. Su tono apocalíptico despista: parece la denuncia de un predicador.',
  source: 'Manifiesto del Partido Comunista',
  year: 1848,
  difficulty: 'medium',
};

const meta: Meta<AnswerRevealComponent> = {
  title: 'Juego/AnswerReveal',
  component: AnswerRevealComponent,
  args: { correct: true, character: marx, question, points: 140, timedOut: false },
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
