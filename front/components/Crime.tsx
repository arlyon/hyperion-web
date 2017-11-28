import * as React from "react";
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
} from 'react-md';
import {MessageBox} from "./Message";

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


/**
 * The crime class.
 */
export class CrimeList extends React.Component<{ postcode }, CrimeState> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param {{}} props The props (none).
     */
    constructor(props: { postcode }) {
        super(props);

        this.state = {
            crimes: []
        };

        if (this.props.postcode) {
            this.fetchData(this.props.postcode)
        }

    }

    /**
     * Called when the component get its props.
     * @param {Readonly<P>} nextProps The next props.
     */
    public componentWillReceiveProps(nextProps) {
        if (this.props.postcode !== nextProps.postcode) {
            if (nextProps.postcode === null) {
                this.setState({crimes: []});
            }
            else {
                this.fetchData(nextProps.postcode);
            }
        }
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData(postcode) {
        const response = await fetch(`/api/crime/${postcode}`);
        this.setState({crimes: await response.json()});

    }

    /**
     * Counts occurrences of crimes and returns an object associating crimes to counts
     * @param crimes the list of crimes in that area
     * @returns {number[]} returns an array list of occurance of crimes in order specified
     */
    private summarizeCategories(crimes: any[]) {
        const data = {};

        crimes.forEach((crime) => {
            if (data[crime.category]) {
                data[crime.category] += 1;
            } else {
                data[crime.category] = 1;
            }
        });

        return data;
    }

    /**
     * Given a hyphenated string, de-hyphenates it.
     * @param {string} name
     * @returns {string} The dehypenated string.
     */
    private static dehyphenate(name: string): string {
        const words = name.split("-");
        const capitalized = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalized.join(" ");
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    render() {
        const listOfCrimes = this.summarizeCategories(this.state.crimes)
        const crimeSummary = Object.keys(listOfCrimes).map((key, index) => (
            <TableRow key={index}>
                <TableColumn>{CrimeList.dehyphenate(key)}</TableColumn>
                <TableColumn>{listOfCrimes[key]}</TableColumn>
            </TableRow>
        ));

        const style = {
            width: "100%"
        };

        if (crimeSummary.length) {
            return (
                <DataTable plain={true}>
                    <TableHeader>
                        <TableRow>
                            <TableColumn>Crime</TableColumn>
                            <TableColumn>Count</TableColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {crimeSummary}
                    </TableBody>
                </DataTable>)
        }
        return <MessageBox message="No Thefts In Your Area"/>
    }
}
