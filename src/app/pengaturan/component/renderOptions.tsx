import { Wilayah } from "@/hooks/use-wilayah";

export function renderOptions(
  items: Wilayah[],
  valueKey: keyof Wilayah,
  labelKey: keyof Wilayah,
  placeholder: string
) {
  return (
    <>
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={String(item[valueKey])} value={String(item[valueKey])}>
          {String(item[labelKey])}
        </option>
      ))}
    </>
  );
}
