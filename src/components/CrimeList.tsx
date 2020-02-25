import * as React from "react";
import {DataTable, TableBody, TableColumn, TableHeader, TableRow,} from 'react-md';
import {MessageBox} from "./Message";
import {CrimeData} from "../interfaces/Crime";

interface ICrimeListProps {
    crimes: CrimeData[] | null,
}

/**
 * Given a postcode, displays a list of crimes in the area.
 */
export class CrimeList extends React.Component<ICrimeListProps> {

    /**
     * Counts occurrences of crimes and returns an object associating crimes to counts
     * @param crimes the list of crimes in that area
     * @returns {number[]} returns an array list of occurance of crimes in order specified
     */
    private summarizeCategories(crimes: CrimeData[]) {
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
        let crimeSummary;
        if (this.props.crimes) {
            const crimeList = this.summarizeCategories(this.props.crimes);
            crimeSummary = Object.keys(crimeList)
                .map((key, index) => (
                    <TableRow key={index}>
                        <TableColumn>{CrimeList.dehyphenate(key)}</TableColumn>
                        <TableColumn>{crimeList[key]}</TableColumn>
                    </TableRow>
                ));
        }

        if (crimeSummary?.length) {
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
