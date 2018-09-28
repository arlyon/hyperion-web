import * as React from "react";
import {DataTable, TableBody, TableColumn, TableHeader, TableRow,} from 'react-md';
import {MessageBox} from "./Message";
import {CrimeData} from "../interfaces/Crime";

/**
 * The state for the CrimeList component.
 */
interface CrimeState {
    crimes: CrimeData[]
}

interface ICrimeListProps {
    postcode: string
}

/**
 * Given a postcode, displays a list of crimes in the area.
 */
export class CrimeList extends React.Component<ICrimeListProps, CrimeState> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param props The props.
     */
    constructor(props: ICrimeListProps) {
        super(props);

        this.state = {
            crimes: []
        };

        if (this.props.postcode) {
            this.fetchData(this.props.postcode)
        }
    }

    /**
     * Fetches new data if the postcode changes.
     * @param props The next props.
     */
    public componentWillReceiveProps(props: ICrimeListProps) {
        if (this.props.postcode !== props.postcode && props.postcode !== null) {
            this.fetchData(props.postcode);
        }
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData(postcode) {
        const response = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/crime/`);
        this.setState({crimes: response.status == 200 ? await response.json() : []});
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
        const listOfCrimes = this.summarizeCategories(this.state.crimes);
        const crimeSummary = Object.keys(listOfCrimes).map((key, index) => (
            <TableRow key={index}>
                <TableColumn>{CrimeList.dehyphenate(key)}</TableColumn>
                <TableColumn>{listOfCrimes[key]}</TableColumn>
            </TableRow>
        ));

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
        return <MessageBox message="No Crime In Your Area"/>
    }
}
