// components/AddressSelect.tsx
import { Label } from "@/components/ui/label";
import { Wilayah } from "@/hooks/use-wilayah";

interface AddressSelectProps {
    label: string;
    items: Wilayah[];
    valueKey: keyof Wilayah;
    labelKey: keyof Wilayah;
    placeholder: string;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export default function AddressSelect({
    label,
    items,
    valueKey,
    labelKey,
    placeholder,
    disabled,
    value,
    onChange,
}: AddressSelectProps) {
    return (
        <div>
            <Label>{label}</Label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input w-full"
            >
                <option value="">{placeholder}</option>
                {items.map((item) => (
                    <option key={String(item[valueKey])} value={String(item[valueKey])}>
                        {String(item[labelKey])}
                    </option>
                ))}
            </select>
        </div>
    );
}
