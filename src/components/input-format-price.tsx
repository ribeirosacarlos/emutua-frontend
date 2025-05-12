import { Input } from "./ui/input";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { forwardRef } from "react";

interface PriceFormatInputProps extends Omit<NumericFormatProps, 'reference'> {
    onValueChange?: (values: { value: string }) => void;
}

const PriceFormatInput = forwardRef<HTMLInputElement, PriceFormatInputProps>((
    props,
    ref
) => {
    return (
        <NumericFormat
            {...props}
            customInput={Input}
            getInputRef={ref}
        />
    );
});

// Adiciona um displayName para melhor debugging
PriceFormatInput.displayName = 'PriceFormatInput';

export default PriceFormatInput;