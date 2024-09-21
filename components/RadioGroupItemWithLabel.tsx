import type { SizeTokens } from "tamagui";
import { Label, RadioGroup, XStack } from "tamagui";

type Props = {
  size: SizeTokens;
  value: string;
  label: string;
};

export default function RadioGroupItemWithLabel(props: Props) {
  const id = `radiogroup-${props.value}`;

  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <Label size={props.size} htmlFor={id} style={{ color: "white" }}>
        {props.label}
      </Label>
    </XStack>
  );
}
