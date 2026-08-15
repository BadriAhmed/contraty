"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Props {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function AutocompleteInput({ value, options, placeholder, onChange }: Props) {
  const [opened, setOpened] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const query = value.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!query) return options.slice(0, 8);
    return options.filter((o) => o.toLowerCase().includes(query)).slice(0, 8);
  }, [options, query]);

  // Close when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpened(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setHighlight(-1), [value]);

  const select = (opt: string) => {
    onChange(opt);
    setOpened(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpened(true);
      setHighlight((h) => (h + 1) % Math.max(matches.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpened(true);
      setHighlight((h) => (h - 1 + Math.max(matches.length, 1)) % Math.max(matches.length, 1));
    } else if (e.key === "Enter" && opened && highlight >= 0 && matches[highlight]) {
      e.preventDefault();
      select(matches[highlight]);
    } else if (e.key === "Escape") {
      setOpened(false);
    }
  };

  // Show only after the user typed a letter or explicitly opened the dropdown
  const showList = opened && matches.length > 0;
  const showEmpty = opened && query.length > 0 && matches.length === 0;

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpened(true);
        }}
        onClick={() => setOpened(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="input-field text-base rounded-xl pe-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpened((o) => !o);
        }}
        aria-label="toggle suggestions"
        className="absolute inset-y-0 end-0 flex items-center px-3 text-text-secondary hover:text-primary transition-colors"
      >
        <ChevronDown size={16} className={`transition-transform ${opened ? "rotate-180" : ""}`} />
      </button>
      {(showList || showEmpty) && (
        <div className="absolute z-20 start-0 end-0 mt-1.5 max-h-72 overflow-y-auto bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-xl p-1.5">
          {matches.map((opt, i) => {
            const active = i === highlight;
            const selected = opt === value.trim();
            return (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(opt)}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full flex items-center gap-2 text-start text-sm px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer truncate ${
                  active ? "bg-primary/10 text-primary font-medium" : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="flex-1 truncate">{opt}</span>
                {selected && <Check size={14} className="text-primary shrink-0" />}
              </button>
            );
          })}
          {showEmpty && (
            <p className="px-3.5 py-2.5 text-sm text-text-secondary">
              <span className="rtl:hidden">Aucune suggestion — saisissez votre propre valeur</span>
              <span className="ltr:hidden">لا توجد اقتراحات — اكتب القيمة التي تريدها</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
