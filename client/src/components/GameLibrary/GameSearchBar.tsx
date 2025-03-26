// src/components/GameLibrary/GameSearchBar.tsx
import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textColor};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryColor};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColorLight};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textColorSecondary};
`;

interface GameSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GameSearchBar: React.FC<GameSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search for games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchIcon>🔍</SearchIcon>
    </SearchContainer>
  );
};

export default GameSearchBar;
