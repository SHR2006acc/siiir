"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, Search } from "lucide-react";

type LocationComboboxProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onSwap?: () => void;
};

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLocaleLowerCase("fr")
  .trim();

export function LocationCombobox({ label, value, options, onChange, onSwap }: LocationComboboxProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = `location-${label.toLocaleLowerCase("fr").replace(/\W+/g, "-")}`;

  useEffect(() => setQuery(value), [value]);

  const filtered = useMemo(() => {
    const searched = normalize(query);
    if (!searched || query === value) return options.slice(0, 12);
    return options
      .filter((option) => normalize(option).includes(searched))
      .slice(0, 12);
  }, [options, query, value]);

  function select(option: string) {
    onChange(option);
    setQuery(option);
    setOpen(false);
    setActiveIndex(0);
  }

  return (
    <div
      className="field location-field"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery(value);
        }
      }}
    >
      <label htmlFor={listId}>{label}</label>
      <div className="location-input-row">
        <MapPin aria-hidden="true" />
        <input
          ref={inputRef}
          id={listId}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${listId}-options`}
          aria-activedescendant={open && filtered[activeIndex] ? `${listId}-option-${activeIndex}` : undefined}
          autoComplete="off"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setOpen(true);
            setActiveIndex(0);
            const exact = options.find((option) => normalize(option) === normalize(next));
            if (exact) onChange(exact);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            } else if (event.key === "Enter" && open && filtered[activeIndex]) {
              event.preventDefault();
              select(filtered[activeIndex]);
            } else if (event.key === "Escape") {
              setOpen(false);
              setQuery(value);
            }
          }}
          required
        />
        <ChevronDown aria-hidden="true" className="location-chevron" />
      </div>
      {open && (
        <div className="location-options" id={`${listId}-options`} role="listbox">
          <div className="location-options-title"><Search aria-hidden="true" /> Rechercher et sélectionner</div>
          {filtered.length ? filtered.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={option === value}
              className={index === activeIndex ? "active" : ""}
              id={`${listId}-option-${index}`}
              key={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(option)}
            >
              <MapPin aria-hidden="true" />
              <span>{option}</span>
              {option === value && <b>✓</b>}
            </button>
          )) : <p>Aucune ville trouvée</p>}
        </div>
      )}
      {onSwap && <button type="button" aria-label="Inverser le trajet" className="swap" onClick={() => { onSwap(); inputRef.current?.focus(); }}>⇄</button>}
    </div>
  );
}
