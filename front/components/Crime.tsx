import * as React from "react";
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
} from 'react-md';

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
            this.fetchData(postcode)
        }

    }

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

    private static readableCategories(categoryName: string) {
        switch (categoryName) {
            case "all-crime":
                return "All crime";
            case "anti-social-behaviour":
                return "Anti-social behaviour";
            case "bicycle-theft":
                return "Bicycle theft";
            case "burglary":
                return "Burglary";
            case "criminal-damage-arson":
                return "Criminal damage and arson";
            case "drugs":
                return "Drugs";
            case "other-theft":
                return "Other theft";
            case "possession-of-weapons":
                return "Possession of weapons";
            case "public-order":
                return "Public order";
            case "robbery":
                return "Robbery";
            case "shoplifting":
                return "Shoplifting";
            case "theft-from-the-person":
                return "Theft from the person";
            case "vehicle-crime":
                return "Vehicle crime";
            case "violent-crime":
                return "Violent and sexual offences";
            case "other-crime":
                return "Other crime";
            default:
                return "idk lol";
        }
    }

    /**
     * Counts occurance of crimes and returns an array list of the values
     *  [0] Anti-social behaviour
     *  [1] Bicycle theft
     *  [2] Burglary
     *  [3] Criminal damage and arson
     *  [4] Drugs
     *  [5] Other theft
     *  [6] Possession of weapons
     *  [7] Public order
     *  [8] Robbery
     *  [9] Shoplifting
     *  [10] Theft from the person
     *  [11] Vehicle crime
     *  [12] Violent and sexual offences
     *  [13] Other crime
     * @param crimes the list of crimes in that area
     * @returns {number[]} returns an array list of occurance of crimes in order specified
     */
    private summarizeCategories(crimes) {
        let allcrime: number = 0;
        let antisocial: number = 0;
        let bicycletheft: number = 0;
        let burglary: number = 0;
        let criminaldamage: number = 0;
        let drugs: number = 0;
        let othertheft: number = 0;
        let possessionofweapons: number = 0;
        let publicorder: number = 0;
        let robbery: number = 0;
        let shoplifting: number = 0;
        let theftfromperson: number = 0;
        let vehiclecrime: number = 0;
        let violentcrime: number = 0;
        let othercrime: number = 0;

        for (let crime of crimes) {
            switch (crime.category) {
                case "all-crime":
                    allcrime++;
                case "anti-social-behaviour":
                    console.log(antisocial);
                    antisocial++;
                case "bicycle-theft":
                    bicycletheft++;
                case "burglary":
                    burglary++;
                case "criminal-damage-arson":
                    criminaldamage++;
                case "drugs":
                    drugs++;
                case "other-theft":
                    othertheft++;
                case "possession-of-weapons":
                    possessionofweapons++;
                case "public-order":
                    publicorder++;
                case "robbery":
                    robbery++;
                case "shoplifting":
                    shoplifting++;
                case "theft-from-the-person":
                    theftfromperson++;
                case "vehicle-crime":
                    vehiclecrime++;
                case "violent-crime":
                    violentcrime++;
                case "other-crime":
                    othercrime++;
            }
        }
        let list: number[] = [allcrime, antisocial, bicycletheft, burglary, criminaldamage, drugs, othertheft, possessionofweapons, publicorder, robbery, shoplifting, theftfromperson, vehiclecrime, violentcrime, othercrime]
        return list;
    }

    private existsData(list: number[]) {
        for (let x of list) {
            if (x > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    render() {
        let listOfCrimes: number [] = this.summarizeCategories(this.state.crimes);
        if (this.existsData(listOfCrimes)) {
            return<div>
                <table>
                    <tbody>
                    <tr>
                        <td><b>All crime:</b></td>
                        <td>{listOfCrimes[0]}</td>
                    </tr>
                    <tr>
                        <td><b>Anti-social behaviour:</b></td>
                        <td>{listOfCrimes[1]}</td>
                    </tr>
                    <tr>
                        <td><b>Bicycle theft:</b></td>
                        <td>{listOfCrimes[2]}</td>
                    </tr>
                    <tr>
                        <td><b>Burglary:</b></td>
                        <td>{listOfCrimes[3]}</td>
                    </tr>
                    <tr>
                        <td><b>Criminal damage and arson:</b></td>
                        <td>{listOfCrimes[4]}</td>
                    </tr>
                    <tr>
                        <td><b>Other theft:</b></td>
                        <td>{listOfCrimes[5]}</td>
                    </tr>
                    <tr>
                        <td><b>Possession of weapons:</b></td>
                        <td>{listOfCrimes[6]}</td>
                    </tr>
                    <tr>
                        <td><b>Public order:</b></td>
                        <td>{listOfCrimes[7]}</td>
                    </tr>
                    <tr>
                        <td><b>Robbery:</b></td>
                        <td>{listOfCrimes[8]}</td>
                    </tr>
                    <tr>
                        <td><b>Shoplifting:</b></td>
                        <td>{listOfCrimes[9]}</td>
                    </tr>
                    <tr>
                        <td><b>Theft from the person:</b></td>
                        <td>{listOfCrimes[10]}</td>
                    </tr>
                    <tr>
                        <td><b>Vehicle crime:</b></td>
                        <td>{listOfCrimes[11]}</td>
                    </tr>
                    <tr>
                        <td><b>Violent and sexual offences:</b></td>
                        <td>{listOfCrimes[12]}</td>
                    </tr>
                    <tr>
                        <td><b>Other crime:</b></td>
                        <td>{listOfCrimes[13]}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        }
        return<h1>Doesn't display!</h1>
    }
                /**
                * Displays a crime, given the data for it.
                * @param {CrimeData} props The crime data for the crime.
                * @returns {HTMLElement} The markup for the crime.

                const CrimeEntry = (props: CrimeData) => {
                return (
                <tr>
                <td>{props.id}</td>
                <td>{props.category}</td>
                <td>{props.month}</td>
                <td>{props.location.street.name.replace("On or near ", "")}</td>
                <td>{props.context}</td>
                </tr>
*/


            }
