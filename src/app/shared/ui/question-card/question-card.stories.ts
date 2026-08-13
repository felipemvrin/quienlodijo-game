import type { Meta, StoryObj } from '@storybook/angular';
import { QuestionCardComponent } from './question-card.component';
import type { Question } from '../../../game/models/question.model';

const question: Question = {
  id: 'q-marx-01',
  quote: 'La religión es el opio del pueblo.',
  correctAnswer: 'marx',
  explanation:
    'La cita completa habla de la religión como «el suspiro de la criatura oprimida»: es más compleja de lo que suele recordarse.',
  source: 'Contribución a la crítica de la filosofía del derecho de Hegel',
  year: 1844,
  difficulty: 'easy',
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
