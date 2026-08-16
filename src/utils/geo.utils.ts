export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 *
 * This function will return the distance in kilometers.
 *
 * @param {Coordinates} firstLocation The first location coordinates.
 * @param {Coordinates} secondLocation The second location coordinates.
 *
 * @returns {number} The distance between the two points in kilometers.
 */
export const calculateDistanceWithHaversine = (
    firstLocation: Coordinates,
    secondLocation: Coordinates,
): number => {
    const R = 6371; // Earth's radius in kilometers

    // Transform the coordinates from degrees to radians.
    const lat1 = (firstLocation.latitude * Math.PI) / 180;
    const lat2 = (secondLocation.latitude * Math.PI) / 180;
    const lon1 = (firstLocation.longitude * Math.PI) / 180;
    const lon2 = (secondLocation.longitude * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    // Haversine computation
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    // Central angle
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
};
