import { DateRange } from "@app-types/events";
import Button from "@shared/button";

import type { RangeSelectorProps } from "./rangeSelector.types";

import styles from "./rangeSelector.module.scss";

const RANGE_OPTIONS = [
  { value: DateRange.day, label: "1 Day", description: "Show events for 1 day" },
  { value: DateRange.week, label: "7 Days", description: "Show events for 7 days" },
  { value: DateRange.month, label: "30 Days", description: "Show events for 30 days" },
];

function RangeSelector({ value, onChange, disabled = false }: RangeSelectorProps) {
  return (
    <div
      className={styles.container}
      role="group"
      aria-label="Date range selection"
    >
      {RANGE_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            variant={isSelected ? "primary" : "secondary"}
            className={styles.button}
            aria-pressed={isSelected}
            aria-label={option.description}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export default RangeSelector;
