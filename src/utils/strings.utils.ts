/**
 * Convert an object to a string of its values.
 *
 * @example { INACTIVE = 'inactive', ACTIVE = 'active' } "'inactive', 'active'"
 * @example { INACTIVE: 'inactive', ACTIVE: 'active' } "'inactive', 'active'"
 *
 * @param {object} objectValue The object to convert to a string.
 *
 * @returns {string} The combined string of the object values.
 */
export const objectValuesToString = (objectValue: object): string => {
    return Object.values(objectValue)
        .map((obj) => `'${obj}'`)
        .join(", ");
};
