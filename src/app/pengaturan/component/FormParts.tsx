import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const InputGroup = ({
  label,
  reg,
  ...rest
}: {
  label: string;
  reg: any;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    <Input {...reg} {...rest} />
  </div>
);

export const SelectGroup = ({
  label,
  reg,
  options,
  disabled,
}: {
  label: string;
  reg: any;
  options: React.ReactNode;
  disabled?: boolean;
}) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    <select {...reg} disabled={disabled} className="input w-full border rounded p-2">
      {options}
    </select>
  </div>
);

export const Radio = ({
  label,
  value,
  reg,
}: {
  label: string;
  value: string;
  reg: any;
}) => (
  <label className="flex items-center gap-2">
    <input type="radio" value={value} {...reg} />
    {label}
  </label>
);
