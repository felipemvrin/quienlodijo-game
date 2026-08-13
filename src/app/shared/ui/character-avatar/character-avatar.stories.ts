import type { Meta, StoryObj } from '@storybook/angular';
import { CharacterAvatarComponent } from './character-avatar.component';

const meta: Meta<CharacterAvatarComponent> = {
  title: 'UI/CharacterAvatar',
  component: CharacterAvatarComponent,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    image: '👑',
    label: 'La Corona',
    color: '#ffcf3f',
    size: 'md',
    active: false,
  },
};

export default meta;
type Story = StoryObj<CharacterAvatarComponent>;

export const Default: Story = {};

export const Activo: Story = {
  args: { active: true, size: 'lg' },
};

export const Pequeno: Story = {
  args: { size: 'sm', image: '🦉', label: 'El Búho', color: '#3ddc84' },
};
