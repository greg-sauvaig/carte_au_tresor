import { useState } from 'react';

const useGameState = () => {
  const [start, setStart] = useState(null);
  return [start, setStart];
};

export default useGameState;