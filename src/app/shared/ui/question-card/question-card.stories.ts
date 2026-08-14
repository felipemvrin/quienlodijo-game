import type { Meta, StoryObj } from '@storybook/angular';
import { QuestionCardComponent } from './question-card.component';
import type { Question } from '../../../game/models/question.model';

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

const meta: Meta<QuestionCardComponent> = {
  title: 'Juego/QuestionCard',
  component: QuestionCardComponent,
  args: { question, revealed: false },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<QuestionCardComponent>;

export const SinRevelar: Story = {};

export const Revelada: Story = {
  args: { revealed: true },
};
