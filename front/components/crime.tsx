import * as React from "react";

/**
 * The state for the CrimeList component.
 */
interface ICrimeState {
    crimes: ICrimeAtLocation[];
}

/**
 * The crime class.
 */
export class CrimeList extends React.Component<{}, ICrimeState> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param {{}} props The props (none).
     */
    constructor(props: ICrimeState) {
        super(props);

        this.state = {
            crimes: [],
        };

        // this.fetchData();
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    public render() {
        const crimes = this.state.crimes.map((crime: ICrimeAtLocation, index: number) => (
            <CrimeEntry
                key={index}
                {...crime}
            />
        ));
        return (
            <div>
                <h1>Crimes</h1>
                {crimes}
            </div>
        );
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData() {
        const response = await fetch("/api/crime/LE33AN");
        this.setState({crimes: await response.json()})
    }
}

/**
 * Displays a crime, given the data for it.
 * @param {ICrimeAtLocation} props The crime data for the crime.
 * @returns {HTMLElement} The markup for the crime.
 */
const CrimeEntry = (props: ICrimeAtLocation) => {
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
    );
};
