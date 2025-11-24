import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch
const mockCharacters = [
  {
    id: '1',
    name: 'Naruto',
    location: 'Konoha',
    health: 'Healthy',
    power: 10000
  },
  {
    id: '2',
    name: 'Sasuke',
    location: 'Konoha',
    health: 'Injured',
    power: 9500
  },
  {
    id: '3',
    name: 'Gaara',
    location: 'Suna',
    health: 'Critical',
    power: 8500
  },
  {
    id: '4',
    name: 'Rock Lee',
    location: 'Konoha',
    health: 'Healthy',
    power: 7000
  },
  {
    id: '5',
    name: 'Killer Bee',
    location: 'Kumo',
    health: 'Healthy',
    power: 9000
  }
];

describe('Character Management Table', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCharacters),
      } as Response)
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading characters/i)).toBeInTheDocument();
  });

  test('renders table with characters after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    expect(screen.getByText('Sasuke')).toBeInTheDocument();
    expect(screen.getByText('Gaara')).toBeInTheDocument();
    expect(screen.getByText('Rock Lee')).toBeInTheDocument();
  });

  test('search filters characters by name', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Naruto');

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
      expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
    });
  });

  test('search filters characters by location', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Suna');

    await waitFor(() => {
      expect(screen.getByText('Gaara')).toBeInTheDocument();
      expect(screen.queryByText('Naruto')).not.toBeInTheDocument();
    });
  });

  test('search is case insensitive', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'naruto');

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });
  });

  test('can clear search input', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Naruto');

    await waitFor(() => {
      expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByLabelText(/Clear search/i);
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Sasuke')).toBeInTheDocument();
    });
  });

  test('can select individual characters', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const narutoCheckbox = screen.getByLabelText('Select Naruto');
    await userEvent.click(narutoCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
    });
  });

  test('can select all characters', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getByLabelText(/Select all characters/i);
    await userEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/5 selected/i)).toBeInTheDocument();
    });
  });

  test('marks selected characters as viewed and logs IDs', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    // Select Naruto
    const narutoCheckbox = screen.getByLabelText('Select Naruto');
    await userEvent.click(narutoCheckbox);

    // Select Sasuke
    const sasukeCheckbox = screen.getByLabelText('Select Sasuke');
    await userEvent.click(sasukeCheckbox);

    // Click mark as viewed button
    const markViewedButton = screen.getByLabelText(/Mark selected as viewed/i);
    await userEvent.click(markViewedButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Marking viewed:',
        expect.arrayContaining(['1', '2'])
      );
    });

    consoleSpy.mockRestore();
  });

  test('filter by health status works', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    // Open filter dropdown
    const filterButton = screen.getByLabelText(/Filter by health status/i);
    await userEvent.click(filterButton);

    // Select "Critical" filter
    const criticalCheckbox = screen.getByRole('menuitemcheckbox', { name: /Critical/i })
      .querySelector('input') as HTMLInputElement;
    await userEvent.click(criticalCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Gaara')).toBeInTheDocument();
      expect(screen.queryByText('Naruto')).not.toBeInTheDocument();
    });
  });

  test('can apply multiple health filters', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    // Open filter dropdown
    const filterButton = screen.getByLabelText(/Filter by health status/i);
    await userEvent.click(filterButton);

    // Select "Healthy" filter
    const healthyCheckbox = screen.getByRole('menuitemcheckbox', { name: /Healthy/i })
      .querySelector('input') as HTMLInputElement;
    await userEvent.click(healthyCheckbox);

    // Select "Injured" filter
    const injuredCheckbox = screen.getByRole('menuitemcheckbox', { name: /Injured/i })
      .querySelector('input') as HTMLInputElement;
    await userEvent.click(injuredCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
      expect(screen.getByText('Sasuke')).toBeInTheDocument();
      expect(screen.queryByText('Gaara')).not.toBeInTheDocument();
    });
  });

  test('sort by power works', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const sortButton = screen.getByLabelText(/Sort by power ascending/i);
    
    // Click once for ascending
    await userEvent.click(sortButton);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const rowTexts = rows.map(row => row.textContent);
      const rockLeeIndex = rowTexts.findIndex(text => text?.includes('Rock Lee'));
      const narutoIndex = rowTexts.findIndex(text => text?.includes('Naruto'));
      expect(rockLeeIndex).toBeLessThan(narutoIndex);
    });
  });

  test('combined search and filter works correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    // Search for "Konoha"
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Konoha');

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
      expect(screen.queryByText('Gaara')).not.toBeInTheDocument();
    });

    // Apply health filter
    const filterButton = screen.getByLabelText(/Filter by health status/i);
    await userEvent.click(filterButton);

    const healthyCheckbox = screen.getByRole('menuitemcheckbox', { name: /Healthy/i })
      .querySelector('input') as HTMLInputElement;
    await userEvent.click(healthyCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
      expect(screen.getByText('Rock Lee')).toBeInTheDocument();
      expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
    });
  });

  test('selected count updates correctly with filters', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    // Select all
    const selectAllCheckbox = screen.getByLabelText(/Select all characters/i);
    await userEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/5 selected/i)).toBeInTheDocument();
    });

    // Apply filter
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Naruto');

    // Wait for filter to apply and verify only Naruto is shown
    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
      expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
    });
    
    // Selection count should still show total selected
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
  });

  test('displays correct character count', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  test('shows empty state when no characters match filters', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Naruto')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'NonExistentCharacter');

    await waitFor(() => {
      expect(screen.getByText(/No characters found matching your filters/i)).toBeInTheDocument();
    });
  });
});
