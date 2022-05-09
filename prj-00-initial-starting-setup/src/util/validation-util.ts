export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validateInputValue(input: Validatable): boolean {
    let isValid = true;

    if (input.required) {
        isValid = isValid && !!input.value.toString().length;
    }

    if (typeof input.value === 'string') {
        if (input.minLength != null) {
            isValid = isValid && input.value.length >= input.minLength;
        }
        if (input.maxLength != null) {
            isValid = isValid && input.value.length <= input.maxLength;
        }
    }

    if (typeof input.value === 'number') {
        if (input.min) {
            isValid = isValid && input.value >= input.min;
        }
        if (input.max) {
            isValid = isValid && input.value <= input.max;
        }
    }

    return isValid;
}
