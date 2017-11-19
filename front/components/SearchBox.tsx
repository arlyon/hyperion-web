import * as React from "react";
import {
    TextField,
    Button,
} from "react-md";
import {IAddress} from "../interfaces/Address";
import {INeighbourhood} from "../interfaces/Neighbourhood";
import {AreaData} from "./AreaData";

interface ISearchState {
    searchString: string,
    error: boolean,
    match: boolean,
    region: string,
    address: IAddress | null
    neighbourhood: INeighbourhood | null
}

export interface ISearchProps {
    postcodes: {
        [prefix: string]: string
    }
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
            match: false,
        };
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    public render() {

        const areadata = this.state.address || this.state.neighbourhood ?
            <AreaData address={this.state.address} neighbourhood={this.state.neighbourhood}/> :
            null;

        return (
            <div style={{padding: "2em"}}>
                <TextField
                    id="application-title"
                    label="Search For A Postcode"
                    customSize="title"
                    className="md-cell md-cell--12"
                    inlineIndicator={<Button icon={true}>search</Button>}
                    onChange={this.updateSearch}
                    value={this.state.searchString}
                    helpText={this.state.region}
                    helpOnFocus={true}
                    error={this.state.error}
                    style={{color: "green"}}
                />
                {areadata}
            </div>
        );
    }

    /**
     * The update search event handler.
     * @param value
     * @param event
     */
    private updateSearch = (value: string, event: any) => {
        value = value.toUpperCase().replace(" ", "");

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
        const match = re.exec(value);

        this.setState({
            address: null,
            neighbourhood: null,
            match: false,
        });

        let regionName;
        if (match) {
            regionName = this.props.postcodes[match[1]];

            if (match[2].length > 3) {
                this.getPostcodeData(match[0])
            }
        }

        this.setState({
            searchString: value,
            region: regionName ? regionName : null,
            error: value !== "" && regionName === undefined
        });
    };

    private getPostcodeData = async (postcode: string) => {
        const address = fetch(`/api/postcode/${postcode}`);
        const neighbourhood = fetch(`/api/neighbourhood/${postcode}`);

        const address_json = await (await address).json();
        const neighbourhood_json = await (await neighbourhood).json();

        this.setState({
            address: address_json.message ? null : address_json,
            neighbourhood: neighbourhood_json.message ? null : neighbourhood_json,
        })
    }
}