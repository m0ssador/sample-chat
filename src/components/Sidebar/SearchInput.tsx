import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/chatSlice';
import { selectSearchQuery } from '../../store/selectors';
import styles from './SearchInput.module.css';

const SearchInput: React.FC = () => {
  const query = useAppSelector(selectSearchQuery);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.searchContainer}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Поиск по чатам..."
        value={query}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        aria-label="Поиск по названию чата и последнему сообщению"
      />
    </div>
  );
};

export default SearchInput;
