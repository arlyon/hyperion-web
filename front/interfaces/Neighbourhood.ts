/**
 * An interface for neighbourhood data from the police API.
 */
export interface INeighbourhood {
    code: string;
    email: string | null;
    facebook: string | null;
    id: number;
    links: any[];
    locations: any[];
    name: string;
    telephone: string | null;
    twitter: string;
    description: string;
}
