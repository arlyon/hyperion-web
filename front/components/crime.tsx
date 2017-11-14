import * as React from "react";

/**
 * The state for the CrimeList component.
 */
interface CrimeState {
    crimes: CrimeData[]
}

/**
 * The interface for the api response for crime data.
 */
interface CrimeData {
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
}

enum Gender {
    Male,
    Female
}

/**
 * The crime class.
 */
export class CrimeList extends React.Component<{}, CrimeState> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param {{}} props The props (none).
     */
    constructor(props: CrimeState) {
        super(props);

        this.state = {
            crimes: []
        };

        this.fetchData()
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData() {
        const response = await fetch("/api/crime/LE33AN");
        this.setState({crimes: await response.json()})
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    render() {
        const crimes = this.state.crimes.map((crime: CrimeData, index: number) => <CrimeEntry
            key={index} {...crime} />);
        return <div>
            <h1>Crimes</h1>
            {crimes}
        </div>
    }
}

/**
 * Displays a crime, given the data for it.
 * @param {CrimeData} props The crime data for the crime.
 * @returns {HTMLElement} The markup for the crime.
 */
const CrimeEntry = (props: CrimeData) => {
    return (
        <article>
            <h1>Crime {props.location.street.name}</h1>
            <dl>
                <dt>
                    Gender
                </dt>
                <dd>
                    {props.gender}
                </dd>
                <dt>
                    Ethnicity
                </dt>
                <dd>
                    {props.self_defined_ethnicity}
                </dd>
                <dt>
                    Reason
                </dt>
                <dd>
                    {props.object_of_search}
                </dd>
            </dl>
        </article>
    )
};