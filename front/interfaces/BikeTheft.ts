/**
 * An instance of bike theft.
 */
export interface IBikeTheft {
    make?: string,
    model?: string,
    colour?: string,
    latitude?: number,
    longitude?: number,
    frame_number?: string | null,
    rfid?: string | null,
    description?: null | string,
    reported_at?: string | null,
}