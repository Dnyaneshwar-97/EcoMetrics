import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import Badge from './Badge';
import { renderWithI18n } from '../../test/renderWithI18n';

describe('Badge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders carbon score label and category', () => {
    renderWithI18n(<Badge category="High" score={20} />);

    expect(screen.getByRole('status')).toHaveTextContent('Carbon Score');
    expect(screen.getByRole('status')).toHaveTextContent('20/100');
    expect(screen.getByRole('status')).toHaveTextContent('High');
  });

  it('exposes an accessible label for screen readers', () => {
    renderWithI18n(<Badge category="Good" score={65} />);

    expect(screen.getByLabelText(/Carbon score 65 out of 100, Good/i)).toBeInTheDocument();
  });
});
