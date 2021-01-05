export function getRidesPath(timestamp: number): string {
    return `./output/rides/rides_${timestamp}.json`;
}

export function getErrorsPath(timestamp: number): string {
    return `./output/errors/errors_${timestamp}.json`;
}

export function getAggPath(timestamp: number): string {
    return `./output/aggregations/agg_${timestamp}.json`;
}