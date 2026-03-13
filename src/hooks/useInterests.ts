'use client';
import { useState, useEffect } from 'react';
import { getSavedInterests, toggleInterest as toggle } from '../lib/storage';

export function useInterests() {
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    setInterests(getSavedInterests());
  }, []);

  const toggleInterest = (id: string) => {
    const updated = toggle(id);
    setInterests(updated);
  };

  return { interests, toggleInterest };
}
