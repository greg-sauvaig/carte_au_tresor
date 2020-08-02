import { useState } from 'react';

const useGameState = () => {
  const [dropTime, setDropTime] = useState(null);
  return [dropTime, setDropTime];
};

export default useGameState;