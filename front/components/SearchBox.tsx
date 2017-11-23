import * as React from "react";
import {
    Button,
    Autocomplete,
} from "react-md";
import {IAddress} from "../interfaces/Address";
import {INeighbourhood} from "../interfaces/Neighbourhood";
import {PostCodeData} from "./PostCodeData";

interface ISearchState {
    searchString: string,
    error: boolean,
    region: string,
    autoComplete: any[],
    address: IAddress | null
    neighbourhood: INeighbourhood | null
}

export interface ISearchProps {
    postcodes: {
        [prefix: string]: string
    }
    foundValid: (postcode: string) => void
}

/**
 * The search class.
 */
export class SearchBox extends React.Component<ISearchProps, ISearchState> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param {{}} props The props (none).
     */
    constructor(props: ISearchProps) {
        super(props);

        this.state = {
            searchString: "",
            error: false,
            region: "",
            address: null,
            neighbourhood: null,
            autoComplete: [],
        };
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    public render() {
        return (
            <Autocomplete
                id="search"
                label={this.state.region || "Search For A Postcode"}
                className="md-cell md-cell--12"
                inlineIndicator={<Button icon={true}>search</Button>}
                customSize="title"
                filter={null}
                data={this.state.autoComplete}
                value={this.state.searchString}
                onChange={this.handleSearchUpdate}
                onAutocomplete={this.handleAutoComplete}
                error={this.state.error}
                dataLabel="label"
                dataValue="value"
            />
        );
    }

    /**
     * The update search event handler.
     * @param searchString
     */
    private handleSearchUpdate = async (searchString: string) => {
        searchString = searchString.toUpperCase();

        this.setState({
            address: null,
            neighbourhood: null,
        });

        const regionName = this.getRegionForPostcode(searchString);

        this.setState({
            searchString,
            region: regionName ? regionName : null,
            error: searchString !== "" && regionName === undefined,
        });

        if (searchString !== "" && (regionName !== undefined || searchString.length == 1)) this.getAutoCompleteForPostcode(searchString);
    };

    /**
     * Manages the autocomplete click event.
     * @param clickedValue The value that was clicked on.
     */
    private handleAutoComplete = (clickedValue: string) => {
        if (this.state.searchString !== clickedValue) {
            this.setState({searchString: clickedValue});
            this.props.foundValid(clickedValue);
        }
    };

    /**
     * Gets the autocomplete data from the server.
     * @returns {Promise<void>} Returns nothing.
     * TODO calculating the bold doesn't take spaces into account. can lead to malformed highlighting
     */
    private getAutoCompleteForPostcode = async (searchString: string) => {
        const autocomplete_lookup = await fetch(`https://api.postcodes.io/postcodes/${searchString}/autocomplete`);
        const postcodes = (await autocomplete_lookup.json())["result"] || [];

        const processed = postcodes.map((next) => ({
            label: [
                <span key="bold" className="md-font-bold">{next.substring(0, searchString.length)}</span>,
                next.substring(searchString.length),
            ],
            value: next
        }));

        this.setState({
            autoComplete: processed, // make sure it's not null
            error: processed.length === 0 // if no results, the postcode is invalid!
        });

        if (postcodes.length == 1) {
            this.props.foundValid(postcodes[0])
        }
    };

    /**
     * Gets the region and looks up the postcode.
     * @param {string} searchString
     * @returns {string | null} The region.
     */
    private getRegionForPostcode(searchString: string) {
        /**
         * The regex for postcodes. Group one is the
         * zone, and group two is the rest.
         * @type {RegExp}
         *
         * These are all valid post codes.
         * EH47BL
         * LE33AW
         * EC1R4UR
         * EC1A1BB
         * W1A0AX
         * M11AE
         * B338TH
         * CR26XH
         * DN551PT
         * EC1A 1BB
         * W1A 0AX
         * M1 1AE
         * B33 8TH
         * CR2 6XH
         * DN55 1PT
         */
        const re = /^([A-Z]{1,2})([0-9]?[A-Z]?[0-9 ]{0,3}[A-Z]{0,2})$/;
        const match = re.exec(searchString);

        let regionName;
        if (match) {
            regionName = this.props.postcodes[match[1]];
        }
        return regionName
    }
}