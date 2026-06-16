import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import Button from './Button';
import { renderWithI18n } from '../../test/renderWithI18n';

describe('Button', () => {
  it('renders children and responds to clicks', () => {
    const onClick = vi.fn();
    renderWithI18n(<Button onClick={onClick}>Calculate</Button>);

    const button = screen.getByRole('button', { name: 'Calculate' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire when disabled', () => {
    const onClick = vi.fn();
    renderWithI18n(
      <Button onClick={onClick} disabled>
        Save
      </Button>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
