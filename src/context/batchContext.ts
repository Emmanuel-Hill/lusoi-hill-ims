
import { useState } from 'react';

export const useBatchState = (initialBatches: any[] = []) => {
  const [batches, setBatches] = useState(initialBatches);

  const addBatch = (batch: any) => {
    setBatches([...batches, batch]);
  };

  const updateBatch = (updatedBatch: any) => {
    setBatches(batches.map(batch => batch.id === updatedBatch.id ? updatedBatch : batch));
  };

  return {
    batches,
    addBatch,
    updateBatch
  };
};
