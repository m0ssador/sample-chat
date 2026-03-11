import React, { useState } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        placeholder="Поиск по чатам..."
        value={query}
        onChange={handleChange}
      />
      <span>🔍</span>
    </div>
  );
};

export default SearchInput;
