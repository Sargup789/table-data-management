import React, { useState, useRef, useEffect } from 'react';
import { HealthStatus } from '../types';
import '../styles/FilterDropdown.css';

interface FilterDropdownProps {
  selectedFilters: HealthStatus[];
  onFilterChange: (filters: string[]) => void;
}

const healthOptions: HealthStatus[] = ['Healthy', 'Injured', 'Critical'];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedFilters,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (health: HealthStatus) => {
    const newFilters = selectedFilters.includes(health)
      ? selectedFilters.filter(h => h !== health)
      : [...selectedFilters, health];
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Filter by health status"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 3h12M4 6h8M6 9h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {selectedFilters.length > 0 && (
          <span className="filter-badge" aria-label={`${selectedFilters.length} filters active`}>
            {selectedFilters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-dropdown-menu" role="menu">
          <div className="filter-dropdown-header">Filter by Health</div>
          {healthOptions.map(health => (
            <label
              key={health}
              className="filter-option"
              role="menuitemcheckbox"
              aria-checked={selectedFilters.includes(health)}
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(health)}
                onChange={() => handleToggle(health)}
              />
              <span>{health}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

