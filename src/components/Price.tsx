"use client";

import { useApp } from "./AppProvider";

export function Price({ value, className }: { value: number; className?: string }) {
  const { formatPrice } = useApp();
  return <span className={className}>{formatPrice(value)}</span>;
}

