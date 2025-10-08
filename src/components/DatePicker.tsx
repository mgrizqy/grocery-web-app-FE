import { Calendar } from "./ui/calendar";

interface IDateRange {
  from: Date | undefined;
  to: Date | undefined;
}
interface IDatePickerProps {
  range: IDateRange;
  setRange: (range: IDateRange) => void;
}
export default function DatePicker({ range, setRange }: IDatePickerProps) {
  return (
    <Calendar
      mode="range"
      captionLayout="dropdown"
      selected={range}
      onSelect={(newRange) => {
        if (!newRange) {
          setRange({ from: undefined, to: undefined });
        } else {
          setRange({ from: newRange.from, to: newRange.to });
        }
      }}
    />
  );
}
