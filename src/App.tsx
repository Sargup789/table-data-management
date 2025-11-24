import React from 'react';
import { useCharacters } from './hooks/useCharacters';
import { SearchBar } from './components/SearchBar';
import { Table } from './components/Table';
import { Controls } from './components/Controls';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';

function App() {
  const {
    characters,
    selectedIds,
    filters,
    sortDirection,
    isLoading,
    toggleSelection,
    toggleSelectAll,
    updateSearch,
    updateHealthFilter,
    toggleSort,
    markAsViewed,
    getSelectedFromFiltered
  } = useCharacters();

  const filteredSelectedCount = getSelectedFromFiltered?.()?.length ?? 0;

  if (isLoading || !characters || !filters) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Character Management</h1>
          <p>Performance-optimized table with 1500+ entries</p>
        </header>
        <main className="app-content">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Character Management</h1>
        <p>Performance-optimized table with 1500+ entries</p>
      </header>
      
      <main className="app-content">
        <div className="search-section">
          <SearchBar
            value={filters.search}
            onChange={updateSearch}
          />
          <div className="stats">
            <span className="stat-item">
              Total: <strong>{characters.length}</strong> characters
            </span>
          </div>
        </div>

        <Controls
          selectedCount={selectedIds.size}
          filteredSelectedCount={filteredSelectedCount}
          onMarkViewed={() => markAsViewed(true)}
          onMarkUnviewed={() => markAsViewed(false)}
        />

        <Table
          characters={characters}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onToggleSelectAll={toggleSelectAll}
          sortDirection={sortDirection}
          onSort={toggleSort}
          healthFilter={filters.healthFilter}
          onHealthFilterChange={updateHealthFilter}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
