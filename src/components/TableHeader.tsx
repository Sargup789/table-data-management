import React from 'react';
import { SortDirection, HealthStatus } from '../types';
import { FilterDropdown } from './FilterDropdown';
import '../styles/Table.css';

interface TableHeaderProps {
  allSelected: boolean;
  onSelectAll: () => void;
  sortDirection: SortDirection;
  onSort: () => void;
  healthFilter: HealthStatus[];
  onHealthFilterChange: (filters: string[]) => void;
  hasCharacters: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  allSelected,
  onSelectAll,
  sortDirection,
  onSort,
  healthFilter,
  onHealthFilterChange,
  hasCharacters
}) => {
  return (
    <thead>
      <tr>
        <th className="checkbox-column">
          <input
            type="checkbox"
            checked={allSelected && hasCharacters}
            onChange={onSelectAll}
            aria-label="Select all characters"
            disabled={!hasCharacters}
          />
        </th>
        <th>Name</th>
        <th>Location</th>
        <th>
          <div className="header-with-filter">
            Health
            <FilterDropdown
              selectedFilters={healthFilter}
              onFilterChange={onHealthFilterChange}
            />
          </div>
        </th>
        <th>
          <div className="header-with-sort">
            Power
            <button
              className="sort-button"
              onClick={onSort}
              aria-label={`Sort by power ${
                sortDirection === null
                  ? 'ascending'
                  : sortDirection === 'asc'
                  ? 'descending'
                  : 'none'
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`chevron ${sortDirection || ''}`}
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </th>
      </tr>
    </thead>
  );
};

