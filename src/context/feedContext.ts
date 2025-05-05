
import { useState } from 'react';

export const useFeedState = (
  initialFeedTypes: any[] = [],
  initialFeedConsumption: any[] = [],
  initialFeedInventory: any[] = []
) => {
  const [feedTypes, setFeedTypes] = useState(initialFeedTypes);
  const [feedConsumption, setFeedConsumption] = useState(initialFeedConsumption);
  const [feedInventory, setFeedInventory] = useState(initialFeedInventory);

  const addFeedType = (feedType: any) => {
    setFeedTypes([...feedTypes, feedType]);
  };

  const updateFeedType = (updatedFeedType: any) => {
    setFeedTypes(feedTypes.map(type => type.id === updatedFeedType.id ? updatedFeedType : type));
  };

  const deleteFeedType = (feedTypeId: string) => {
    setFeedTypes(feedTypes.filter(type => type.id !== feedTypeId));
  };

  const addFeedConsumption = (consumption: any) => {
    setFeedConsumption([...feedConsumption, consumption]);
  };

  const addFeedInventory = (inventory: any) => {
    setFeedInventory([...feedInventory, inventory]);
  };

  return {
    feedTypes,
    feedConsumption,
    feedInventory,
    addFeedType,
    updateFeedType,
    deleteFeedType,
    addFeedConsumption,
    addFeedInventory
  };
};
