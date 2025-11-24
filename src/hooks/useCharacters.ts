import { useState, useEffect, useMemo, useCallback } from 'react';
import { Character, CharacterWithView, TableFilters, SortDirection } from '../types';

const API_URL = 'http://localhost:3001/characters';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<CharacterWithView[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    healthFilter: []
  });
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data: Character[] = await response.json();
        setCharacters(data.map(char => ({ ...char, viewed: false })));
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const filteredAndSortedCharacters = useMemo(() => {
    let result = [...characters];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        char =>
          char.name.toLowerCase().includes(searchLower) ||
          char.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply health filter
    if (filters.healthFilter.length > 0) {
      result = result.filter(char => filters.healthFilter.includes(char.health));
    }

    // Apply sorting
    if (sortDirection) {
      result.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.power - b.power;
        } else {
          return b.power - a.power;
        }
      });
    }

    return result;
  }, [characters, filters, sortDirection]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredAndSortedCharacters.length && filteredAndSortedCharacters.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedCharacters.map(char => char.id)));
    }
  }, [selectedIds.size, filteredAndSortedCharacters]);

  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const updateHealthFilter = useCallback((healthFilter: string[]) => {
    setFilters(prev => ({ ...prev, healthFilter: healthFilter as any }));
  }, []);

  const toggleSort = useCallback(() => {
    setSortDirection(prev => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  }, []);

  const markAsViewed = useCallback((viewed: boolean) => {
    const selectedArray = Array.from(selectedIds);
    console.log(`Marking ${viewed ? 'viewed' : 'unviewed'}:`, selectedArray);
    
    setCharacters(prev =>
      prev.map(char =>
        selectedIds.has(char.id) ? { ...char, viewed } : char
      )
    );
    
    setSelectedIds(new Set());
  }, [selectedIds]);

  const getSelectedFromFiltered = useCallback(() => {
    const filteredIds = new Set(filteredAndSortedCharacters.map(c => c.id));
    return Array.from(selectedIds).filter(id => filteredIds.has(id));
  }, [selectedIds, filteredAndSortedCharacters]);

  return {
    characters: filteredAndSortedCharacters,
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
  };
};

