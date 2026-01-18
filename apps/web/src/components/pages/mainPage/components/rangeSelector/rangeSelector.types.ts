import type { DateRangeType } from "@app-types/events";

interface RangeSelectorProps {
  value: DateRangeType;
  onChange: (range: DateRangeType) => void;
  disabled?: boolean;
}

export type { RangeSelectorProps };
