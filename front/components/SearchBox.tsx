import * as React from "react";
import {
    Button,
    Autocomplete,
} from "react-md";

/**
 * The internal state for the search box.
 */
interface ISearchState {
    searchString: string,
    error: boolean,
    region: string | null,
    autoComplete: any[],
}

/**
 * The interface for the search props.
 */
export interface ISearchProps {
    regions: {
        [prefix: string]: string
    };
    foundValid: (postcode: string) => void;
    online: boolean;
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

        const search = localStorage.getItem("search");

        this.state = {
            searchString: search ? search : "",
            error: false,
            region: "",
            autoComplete: [],
        };

        if (search) {
            this.getAutoCompleteForPostcode(search)
        }
    }

    /**
     * Manually calls the foundValid function with the current search string.
     */
    private submitPostcode = () => {
        this.props.foundValid(this.state.searchString)
    };

    /**
     * Updates the autocomplete when the client goes online/offline.
     * @param {Readonly<P>} props The new props for the component.
     */
    public componentWillReceiveProps(props) {
        if (!props.online && this.props.online) { // we are online going offline
            this.setState({autoComplete: []})
        } else if (props.online && !this.props.online) {
            this.getAutoCompleteForPostcode(this.state.searchString, props.online)
        }
    }

    /**
     * Sets the error state and vibrates the device.
     * @param {boolean} value
     */
    private setError = (value: boolean) => {
        if (this.state.error !== value) {
            this.setState({error: value});
            if (value === true) {
                navigator.vibrate(300);
            }
        }
    };

    /**
     * The update search event handler.
     * @param searchString
     */
    private handleSearchUpdate = async (searchString: string) => {
        searchString = searchString.toUpperCase();

        if (searchString.length == 0) {
            this.props.foundValid("")
        }

        const regionName = this.getRegionForPostcode(searchString);
        localStorage.setItem("search", searchString);

        this.setState({
            searchString,
            region: regionName
        });

        this.setError(searchString !== "" && regionName === undefined);
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
    private getAutoCompleteForPostcode = async (searchString: string, online = this.props.online) => {
        if (!online) return;

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
        });

        this.setError(postcodes.length === 0);

        if (postcodes.length === 1) {
            this.props.foundValid(postcodes[0])
        }
    };

    /**
     * Gets the region and looks up the postcode.
     * @param {string} searchString
     * @returns {string | null} The region.
     */
    private getRegionForPostcode(searchString: string): string | null {
        const re = /^([A-Z]{1,2})([0-9]?[A-Z]?[0-9 ]{0,3}[A-Z]{0,2})$/;
        const match = re.exec(searchString);
        return match ? this.props.regions[match[1]] : null;
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
                inlineIndicator={<Button icon={true} onClick={this.submitPostcode}>search</Button>}
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
}