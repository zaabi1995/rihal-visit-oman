'use client';
import { useState, useEffect, useCallback } from 'react';
import type { PlannerInput, Itinerary } from '../lib/types';
import {
  savePlannerInput,
  getPlannerInput,
  saveItinerary,
  getItinerary,
} from '../lib/storage';
import { generateItinerary } from '../algorithm/planner';

const DEFAULT_INPUT: PlannerInput = {
  days: 3,
  budget: 'medium',
  month: new Date().getMonth() + 1,
  intensity: 'balanced',
  categories: [],
};

export function usePlanner() {
  const [input, setInput] = useState<PlannerInput>(DEFAULT_INPUT);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInput = getPlannerInput();
    if (savedInput) {
      setInput(savedInput);
    }
    const savedItinerary = getItinerary();
    if (savedItinerary) {
      setItinerary(savedItinerary);
    }
    setLoaded(true);
  }, []);

  // Save input to localStorage on change (after initial load)
  useEffect(() => {
    if (loaded) {
      savePlannerInput(input);
    }
  }, [input, loaded]);

  const updateInput = useCallback((partial: Partial<PlannerInput>) => {
    setInput((prev) => ({ ...prev, ...partial }));
  }, []);

  const generate = useCallback(() => {
    setIsGenerating(true);
    // Use setTimeout to allow the UI to show loading state
    setTimeout(() => {
      try {
        const result = generateItinerary(input);
        setItinerary(result);
        saveItinerary(result);
      } catch (err) {
        console.error('Failed to generate itinerary:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  }, [input]);

  return { input, updateInput, itinerary, generate, isGenerating, loaded };
}
