export class AllowedDuration {
    public readonly min: number;
    public readonly max: number;
    constructor(
        min: number,
        max: number,
    ) {
        this.min = (min);
        this.max = (max);
    }
}
