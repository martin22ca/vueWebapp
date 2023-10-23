
export function capitalizeFirstLetter(inputString) {
    if (typeof inputString !== 'string') {
        return 'Input is not a string';
    }

    // Check if the string is empty
    if (inputString.length === 0) {
        return 'String is empty';
    }

    // Capitalize the first letter and concatenate it with the rest of the string
    const capitalizedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);

    return capitalizedString;
}