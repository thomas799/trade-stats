import { useRef } from 'react';

import { parseQuoteMessage } from '../utils/transformers';

export function useBatchProcessor({ batchSize, onBatchComplete, onQuote }) {
  const localCountRef = useRef(0);

  const processMessage = (rawData) => {
    const quote = parseQuoteMessage(rawData);

    if (onQuote) onQuote(quote);

    localCountRef.current += 1;

    if (localCountRef.current >= batchSize) {
      localCountRef.current = 0;
      if (onBatchComplete) onBatchComplete();
    }
  };

  const resetBatch = () => {
    localCountRef.current = 0;
  };

  return { processMessage, resetBatch };
}
