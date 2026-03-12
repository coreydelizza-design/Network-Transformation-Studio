import { useState, useCallback, useMemo } from 'react';
import type { PatternElement, PatternOverride, CustomerSpecifics } from './types';
import { DEFAULT_CUSTOMER_SPECIFICS } from './types';
import { PATTERN_ELEMENTS } from './patternData';

/**
 * Hook that manages pattern element overrides and customer specifics.
 * Base elements are never mutated — overrides are layered on top.
 */
export function usePatternOverrides() {
  const [overrides, setOverrides] = useState<Record<string, PatternOverride>>({});
  const [customerSpecifics, setCustomerSpecifics] = useState<CustomerSpecifics>({ ...DEFAULT_CUSTOMER_SPECIFICS });
  const [inspectedId, setInspectedId] = useState<string | null>(null);

  /** Apply overrides to a base element, returning merged result. */
  const resolve = useCallback(
    (base: PatternElement): PatternElement => {
      const ov = overrides[base.id];
      return ov ? { ...base, ...ov } : base;
    },
    [overrides],
  );

  /** Get all resolved elements for a given use-case ID. */
  const getElements = useCallback(
    (useCaseId: string): PatternElement[] => {
      const bases = PATTERN_ELEMENTS[useCaseId] || [];
      return bases.map(resolve);
    },
    [resolve],
  );

  /** Get a single resolved element by ID across all use cases. */
  const getElement = useCallback(
    (elementId: string): PatternElement | undefined => {
      for (const bases of Object.values(PATTERN_ELEMENTS)) {
        const found = bases.find(b => b.id === elementId);
        if (found) return resolve(found);
      }
      return undefined;
    },
    [resolve],
  );

  /** Update a single field override for an element. */
  const setOverride = useCallback(
    (elementId: string, field: keyof PatternOverride, value: unknown) => {
      setOverrides(prev => ({
        ...prev,
        [elementId]: { ...(prev[elementId] || {}), [field]: value },
      }));
    },
    [],
  );

  /** Replace the full override object for an element. */
  const setFullOverride = useCallback(
    (elementId: string, ov: PatternOverride) => {
      setOverrides(prev => ({ ...prev, [elementId]: ov }));
    },
    [],
  );

  /** Clear all overrides for an element (revert to base). */
  const clearOverride = useCallback(
    (elementId: string) => {
      setOverrides(prev => {
        const next = { ...prev };
        delete next[elementId];
        return next;
      });
    },
    [],
  );

  /** Update a customer-specifics field. */
  const setSpecific = useCallback(
    <K extends keyof CustomerSpecifics>(key: K, value: CustomerSpecifics[K]) => {
      setCustomerSpecifics(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** Toggle a cloud provider in the list. */
  const toggleCloudProvider = useCallback(
    (provider: string) => {
      setCustomerSpecifics(prev => ({
        ...prev,
        cloudProviders: prev.cloudProviders.includes(provider)
          ? prev.cloudProviders.filter(p => p !== provider)
          : [...prev.cloudProviders, provider],
      }));
    },
    [],
  );

  /** Count how many overrides exist for a use case. */
  const overrideCount = useCallback(
    (useCaseId: string): number => {
      const bases = PATTERN_ELEMENTS[useCaseId] || [];
      return bases.filter(b => overrides[b.id]).length;
    },
    [overrides],
  );

  /** Open / close inspector. */
  const inspectElement = useCallback((id: string | null) => setInspectedId(id), []);

  const inspectedElement = useMemo(
    () => (inspectedId ? getElement(inspectedId) ?? null : null),
    [inspectedId, getElement],
  );

  return {
    getElements,
    getElement,
    resolve,
    overrides,
    setOverride,
    setFullOverride,
    clearOverride,
    overrideCount,
    customerSpecifics,
    setSpecific,
    toggleCloudProvider,
    inspectedId,
    inspectedElement,
    inspectElement,
  };
}

export type PatternOverridesAPI = ReturnType<typeof usePatternOverrides>;
