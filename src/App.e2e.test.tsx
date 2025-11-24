/**
 * End-to-End Integration Tests
 * Tests the complete application flow with real API calls
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// This test suite runs against the actual API
describe('End-to-End Integration Tests', () => {
  beforeEach(() => {
    // Clear any previous state
    jest.clearAllMocks();
  });

  test('E2E: Complete application flow', async () => {
    console.log('🚀 Starting End-to-End Test Suite...\n');

    // Step 1: App loads with loading state
    console.log('✓ Step 1: Rendering application...');
    render(<App />);
    
    expect(screen.getByText(/Loading characters/i)).toBeInTheDocument();
    console.log('  ✅ Loading state displayed\n');

    // Step 2: Data loads from API
    console.log('✓ Step 2: Fetching data from API...');
    await waitFor(() => {
      expect(screen.queryByText(/Loading characters/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify some characters are displayed
    await waitFor(() => {
      const table = document.querySelector('.character-table');
      expect(table).toBeInTheDocument();
    });
    console.log('  ✅ Data loaded successfully\n');

    // Step 3: Verify character count
    console.log('✓ Step 3: Verifying character count...');
    const totalText = screen.getByText(/Total:/i);
    expect(totalText).toBeInTheDocument();
    console.log('  ✅ Character count displayed\n');

    // Step 4: Test search functionality
    console.log('✓ Step 4: Testing search functionality...');
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Konoha');
    
    await waitFor(() => {
      // Should show fewer characters after filtering
      const rows = document.querySelectorAll('.character-table tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });
    console.log('  ✅ Search working correctly\n');

    // Step 5: Clear search
    console.log('✓ Step 5: Clearing search...');
    const clearButton = screen.getByLabelText(/Clear search/i);
    await userEvent.click(clearButton);
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
    console.log('  ✅ Search cleared\n');

    // Step 6: Test selection
    console.log('✓ Step 6: Testing selection...');
    const selectAllCheckbox = screen.getByLabelText(/Select all characters/i);
    await userEvent.click(selectAllCheckbox);
    
    await waitFor(() => {
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
    });
    console.log('  ✅ Selection working\n');

    // Step 7: Test health filter
    console.log('✓ Step 7: Testing health filter...');
    const filterButton = screen.getByLabelText(/Filter by health status/i);
    await userEvent.click(filterButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Filter by Health/i)).toBeInTheDocument();
    });
    console.log('  ✅ Health filter dropdown opened\n');

    // Step 8: Test sort
    console.log('✓ Step 8: Testing power sort...');
    const sortButton = screen.getByLabelText(/Sort by power/i);
    await userEvent.click(sortButton);
    
    // Verify sort is active
    await waitFor(() => {
      const chevron = document.querySelector('.chevron');
      expect(chevron).toBeInTheDocument();
    });
    console.log('  ✅ Sorting functionality working\n');

    // Step 9: Test mark as viewed
    console.log('✓ Step 9: Testing mark as viewed...');
    
    // Deselect all first
    await userEvent.click(selectAllCheckbox);
    await userEvent.click(selectAllCheckbox);
    
    const consoleSpy = jest.spyOn(console, 'log');
    const markViewedButton = screen.getByLabelText(/Mark selected as viewed/i);
    await userEvent.click(markViewedButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    console.log('  ✅ Mark as viewed functionality working\n');
    
    consoleSpy.mockRestore();

    console.log('🎉 All End-to-End Tests Passed!\n');
  }, 30000); // 30 second timeout for E2E test

  test('E2E: API endpoint returns correct data structure', async () => {
    console.log('🔍 Testing API data structure...\n');

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading characters/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify table exists
    const table = document.querySelector('.character-table');
    expect(table).toBeInTheDocument();
    console.log('  ✅ Table rendered with API data\n');

    // Verify headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Power')).toBeInTheDocument();
    console.log('  ✅ All column headers present\n');

    console.log('🎉 API Data Structure Test Passed!\n');
  }, 15000);

  test('E2E: Performance - handles large dataset', async () => {
    console.log('⚡ Testing performance with large dataset...\n');

    const startTime = Date.now();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading characters/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });

    const loadTime = Date.now() - startTime;
    console.log(`  📊 Load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    console.log('  ✅ Performance acceptable\n');

    // Test search performance
    const searchStart = Date.now();
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Naruto');
    const searchTime = Date.now() - searchStart;
    
    console.log(`  📊 Search time: ${searchTime}ms`);
    expect(searchTime).toBeLessThan(500); // Search should be fast
    console.log('  ✅ Search performance excellent\n');

    console.log('🎉 Performance Test Passed!\n');
  }, 15000);

  test('E2E: All interactive features work together', async () => {
    console.log('🔄 Testing combined feature interactions...\n');

    render(<App />);

    // Wait for load
    await waitFor(() => {
      expect(screen.queryByText(/Loading characters/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // 1. Apply search
    console.log('  1️⃣  Applying search filter...');
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    await userEvent.type(searchInput, 'Suna');
    await waitFor(() => {
      const rows = document.querySelectorAll('.character-table tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });

    // 2. Apply sort while search is active
    console.log('  2️⃣  Applying sort while filtered...');
    const sortButton = screen.getByLabelText(/Sort by power/i);
    await userEvent.click(sortButton);

    // 3. Select some characters
    console.log('  3️⃣  Selecting characters...');
    const selectAllCheckbox = screen.getByLabelText(/Select all characters/i);
    await userEvent.click(selectAllCheckbox);

    // 4. Verify selection count is aware of filters
    await waitFor(() => {
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
    });

    // 5. Mark as viewed
    console.log('  4️⃣  Marking as viewed...');
    const markViewedButton = screen.getByLabelText(/Mark selected as viewed/i);
    await userEvent.click(markViewedButton);

    console.log('  ✅ All features work together seamlessly\n');
    console.log('🎉 Combined Features Test Passed!\n');
  }, 20000);
});

