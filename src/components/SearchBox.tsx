import * as React from "react";
import {
    Button,
    Autocomplete,
} from "react-md";

/**
 * The interface for the search box props..
 */
export interface ISearchProps {
    regions: { [prefix: string]: string };
    updatePostcode: (postcode: string | null) => void;
    online: boolean;
}

/**
 * The internal state for the search box.
 */
interface ISearchState {
    searchString: string,
    error: boolean,
    region: string | null | undefined,
    autoComplete: any[],
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

        let search = localStorage.getItem("search");
        search = search ? search : "";

        this.state = {
            searchString: search ? search : "",
            error: false,
            region: this.getRegionNameForPostcode(search),
            autoComplete: [],
        };

        if (!!search) {
            this.getAutoCompleteForPostcode(search)
        }
    }

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
     * Sets the error state and vibrates the device if needed.
     * @param state The new error state.
     */
    private setError = (state: boolean) => {
        if (this.state.error !== state) {
            this.setState({error: state});
            if (state) navigator.vibrate(300);
        }
    };

    /**
     * Handles changes to the search bar, updating the autocomplete and error.
     * @param searchString
     */
    private handleSearchUpdate = async (searchString: string) => {
        searchString = searchString.toUpperCase();

        if (searchString.length == 0) {
            this.props.updatePostcode(null);
            this.setState({
                region: null,
                searchString: "",
                autoComplete: [],
                error: false,
            })
        } else {
            const region = this.getRegionNameForPostcode(searchString);
            if (!!region && searchString != this.state.searchString) this.getAutoCompleteForPostcode(searchString);
            searchString = region === undefined ? this.state.searchString : searchString;

            this.setError(region === undefined);
            this.setState({
                region: region === undefined ? this.state.region : region,
                searchString: searchString,
            });
        }

        localStorage.setItem("search", searchString);
    };

    /**
     * Handles the selection of an autocomplete entry.
     * @param clickedValue The value that was clicked on.
     */
    private handleAutoComplete = (clickedValue: string) => {
        if (this.state.searchString !== clickedValue) {
            this.setState({searchString: clickedValue, autoComplete: [], error: false});
            this.props.updatePostcode(clickedValue);
            localStorage.setItem("search", clickedValue);
        }
    };

    /**
     * Gets the autocomplete data from the server.
     * @returns {Promise<void>} Returns nothing.
     */
    private getAutoCompleteForPostcode = async (searchString: string, online = this.props.online) => {
        if (!online) return;

        const autocomplete_lookup = await fetch(`https://api.postcodes.io/postcodes/${searchString}/autocomplete/`);
        const postcodes = autocomplete_lookup.status == 200 ? (await autocomplete_lookup.json())["result"] : [];

        const autoComplete = postcodes?.length ? postcodes.map((autoComplete) => {
            const highlightLength = this.getHighlightLength(searchString, autoComplete);

            return {
                label: [
                    <span key="bold" className="md-font-bold">{autoComplete.substring(0, highlightLength)}</span>,
                    autoComplete.substring(highlightLength),
                ],
                value: autoComplete
            };
        }) : [];

        // if there is one exact match, show no autocomplete and tell the parent we have a match
        if (autoComplete.length === 1 && searchString.replace(" ", "") === autoComplete[0].value.replace(" ", "")) {
            this.setState({autoComplete: []});
            this.props.updatePostcode(postcodes[0]);
        }
        // otherwise show the autocomplete and tell the parent we no longer have a match
        else {
            this.props.updatePostcode(null);
            this.setState({autoComplete});
        }

        this.setError(postcodes.length === 0);
    };

    /**
     * Given a search string and an autocomplete text returns an index
     * to highlight to on the autoComplete string respecting spaces on both.
     * @param search
     * @param autoComplete
     */
    private getHighlightLength = (search, autoComplete) => {
        let count1 = 0;
        let count2 = 0;

        while (count1 < search.length) {
            if (autoComplete[count2] == ' ')
                count2 += 1;
            else if (search[count1] == ' ')
                count1 += 1;
            else if (search[count1] != autoComplete[count2])
                return count2;
            else {
                count2 += 1;
                count1 += 1;
            }
        }

        return count2
    };


    /**
     * Returns the region name associated with the given postcode.
     * @param {string} postcode
     * @returns The region name, null if the postcode was empty, or undefined if the region does not exist.
     */
    private getRegionNameForPostcode(postcode: string): string | null | undefined {
        if (postcode === "") return null;
        const re = /^([A-Z]{1,2})([0-9]?[A-Z]?[0-9 ]{0,3}[A-Z]{0,2})$/;
        const match = re.exec(postcode);
        if (!match) return undefined;

        const region_pairs = Object.entries(this.props.regions)
            .filter(([key, _]) => key.indexOf(match[1]) === 0);

        if (!region_pairs.length) return undefined;
        else return region_pairs.reduce((smallest, current) => current[0] < smallest[0] ? current : smallest)[1];
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    public render() {
        return (
            <Autocomplete
                id="search"
                label={this.state.region || "Enter a Postcode"}
                inlineIndicator={<Button icon={true} disabled={true}>search</Button>}
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