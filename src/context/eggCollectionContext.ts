
import { useState } from 'react';

export const useEggCollectionState = (initialCollections: any[] = []) => {
  const [eggCollections, setEggCollections] = useState(initialCollections);

  const addEggCollection = (collection: any) => {
    setEggCollections([...eggCollections, collection]);
  };

  return {
    eggCollections,
    addEggCollection
  };
};
