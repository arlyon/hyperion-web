/**
 * The interface for the api response for crime data.
 */
export interface CrimeData {
    persistent_id: number, //Police ID
    month: string,
    category: string,
    location: {
        latitude: number,
        longitude: number,
        street: {
            id: number,
            name: string,
        }
    },
    context: string,
    id: number,

    /*
    age_range: string,
    datetime: string,
    gender: Gender,
    involved_person: boolean,
    legislation: string,
    location: {
        latitude: number,
        longitude: number,
        street: {
            id: number,
            name: string,
        }
    },
    object_of_search: string,
    officer_defined_ethnicity: string,
    operation: any,
    operation_name: any,
    outcome: boolean,
    outcome_linked_to_object_of_search: any,
    outcome_object: {
        id: number | string,
        name: string,
    },
    removal_of_more_than_outer_clothing: boolean | null,
    self_defined_ethnicity: string,
    type: string
    */
}