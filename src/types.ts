export type Location = 'Konoha' | 'Suna' | 'Kiri' | 'Iwa' | 'Kumo';
export type HealthStatus = 'Healthy' | 'Injured' | 'Critical';

export interface Character {
  id: string;
  name: string;
  location: Location;
  health: HealthStatus;
  power: number;
}

export interface CharacterWithView extends Character {
  viewed: boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface TableFilters {
  search: string;
  healthFilter: HealthStatus[];
}

export interface TableState {
  characters: CharacterWithView[];
  filteredCharacters: CharacterWithView[];
  selectedIds: Set<string>;
  filters: TableFilters;
  sortDirection: SortDirection;
  isLoading: boolean;
}

