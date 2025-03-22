import React from 'react';
import styled from 'styled-components';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'nintendo', label: 'Nintendo' },
    { id: 'playstation', label: 'PlayStation' },
    { id: 'xbox', label: 'Xbox' },
    { id: 'pc', label: 'PC Gaming' },
    { id: 'mobile', label: 'Mobile' },
  ];

  return (
    <FilterContainer>
      <FilterList>
        {filters.map((filter) => (
          <FilterItem key={filter.id}>
            <FilterButton 
              isActive={activeFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </FilterButton>
          </FilterItem>
        ))}
      </FilterList>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 10px;
  }
`;

const FilterList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterItem = styled.li`
  flex-shrink: 0;
`;

interface FilterButtonProps {
  isActive: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.buttonText : theme.colors.text};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : `${theme.colors.primary}10`};
  }
`;

export default FilterBar;