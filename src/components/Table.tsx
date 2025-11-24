import React from 'react';
import { List } from 'react-window';
import { CharacterWithView, SortDirection, HealthStatus } from '../types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import '../styles/Table.css';

interface TableProps {
  characters: CharacterWithView[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  sortDirection: SortDirection;
  onSort: () => void;
  healthFilter: HealthStatus[];
  onHealthFilterChange: (filters: string[]) => void;
  isLoading?: boolean;
}

export const Table: React.FC<TableProps> = ({
  characters = [],
  selectedIds = new Set(),
  onToggleSelection,
  onToggleSelectAll,
  sortDirection,
  onSort,
  healthFilter = [],
  onHealthFilterChange,
  isLoading = false
}) => {
  const allSelected = characters.length > 0 && selectedIds.size === characters.length;
  
  // Row height for virtualization
  const ROW_HEIGHT = 57;
  const MAX_HEIGHT = 600;
  
  // Row component for react-window v2
  interface VirtualRowProps {
    index: number;
    style: React.CSSProperties;
    characters: CharacterWithView[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
  }
  
  const VirtualRow = ({ 
    index, 
    style, 
    characters: chars, 
    selectedIds: selected, 
    onToggleSelection: toggle 
  }: VirtualRowProps) => {
    const character = chars[index];
    return (
      <div style={style}>
        <table className="character-table character-table-row" role="presentation">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>
            <TableRow
              character={character}
              isSelected={selected.has(character.id)}
              onToggleSelection={toggle}
            />
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="table-wrapper">
      {isLoading && (
        <div className="table-loading-overlay">
          <div className="table-loading-content">
            <div className="table-spinner" aria-hidden="true"></div>
            <p className="table-loading-text">Loading characters...</p>
          </div>
        </div>
      )}
      
      <table className="character-table" role="table">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <TableHeader
          allSelected={allSelected}
          onSelectAll={onToggleSelectAll}
          sortDirection={sortDirection}
          onSort={onSort}
          healthFilter={healthFilter}
          onHealthFilterChange={onHealthFilterChange}
          hasCharacters={characters.length > 0}
        />
      </table>
      
      {characters.length > 0 ? (
        <div className="table-body-wrapper">
          <List<Omit<VirtualRowProps, 'index' | 'style'>>
            defaultHeight={Math.min(characters.length * ROW_HEIGHT, MAX_HEIGHT)}
            rowCount={characters.length}
            rowHeight={ROW_HEIGHT}
            overscanCount={5}
            rowComponent={VirtualRow}
            rowProps={{
              characters,
              selectedIds,
              onToggleSelection
            }}
          >
            {null}
          </List>
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p>No characters found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

