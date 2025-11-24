import React from 'react';
import { CharacterWithView } from '../types';
import '../styles/Table.css';

interface TableRowProps {
  character: CharacterWithView;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  style?: React.CSSProperties;
}

export const TableRow: React.FC<TableRowProps> = ({
  character,
  isSelected,
  onToggleSelection,
  style
}) => {
  const healthClass = character.health.toLowerCase();

  return (
    <tr
      style={style}
      className={`${isSelected ? 'selected' : ''} ${character.viewed ? 'viewed' : ''}`}
      role="row"
    >
      <td className="checkbox-column">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelection(character.id)}
          aria-label={`Select ${character.name}`}
        />
      </td>
      <td>{character.name}</td>
      <td>{character.location}</td>
      <td>
        <span className={`health-badge ${healthClass}`}>
          {character.health}
        </span>
      </td>
      <td>{character.power.toLocaleString()}</td>
    </tr>
  );
};

