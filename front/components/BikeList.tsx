import * as React from "react";
import {Card, CardTitle, CardText, TextField} from 'react-md';
import {IBikeTheft} from '../interfaces/BikeTheft'
import {MessageBox} from "./Message";

/**
 * Given a postcode, fetches a list of stolen bikes nearby.
 */
export class BikeList extends React.Component <{ postcode }, { bikes: any[], search: string }> {
    constructor(props: { postcode }) {
        super(props);

        this.state = {
            bikes: [],
            search: "",
        };

        if (this.props.postcode) {
            this.fetchData(this.props.postcode);
        }
    }

    /**
     * Called when the component will receive new props and compares them
     * with the old props to determine if more bikes should be fetched.
     * @param {Readonly<P>} nextProps The next props from the server.
     */
    public componentWillReceiveProps(nextProps) {
        if (nextProps.postcode !== this.props.postcode) { //new props object
            //If postcode is null
            if (nextProps.postcode === null) {
                //Remove all displayed data by setting bike state to empty list
                this.setState({bikes: []})
            } //if its not null we want to display all information about that postcode
            this.fetchData(nextProps.postcode);
        }
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData(postcode: string) {
        const response = await fetch(`${process.env.API_URL}/api/bikes/${postcode}`);
        this.setState({bikes: await response.json()})
    }

    /**
     * Called when the filter input updates to make the component controlled.
     * @param {string} value The new value of the input box.
     */
    updateSearch = (value: string) => {
        this.setState({search: value});
    };

    /**
     * Renders the component.
     * @returns {HTMLElement} The markup for the component.
     */
    render() {
        const bikeFilter = (bike: IBikeTheft): boolean => {
            if (this.state.search === "") {
                return true; //Display all if search is empty
            }

            for (let key of Object.keys(bike)) {
                try {
                    if (bike[key].toLowerCase().includes(this.state.search.toLowerCase())) {
                        return true;
                    }
                } catch (Exception) {
                }
            }
            return false
        };

        const bikeMarkUp = this.state.bikes
            .filter(bikeFilter) //passes bike as parameter to function BikeFilter
            .map((stolenBike, index) => <Bike key={index} {...stolenBike} />);

        return (
            this.state.bikes.length ? (
                <section className="bikecontainer">
                    <TextField
                        id="bikefilter"
                        placeholder="Filter..."
                        customSize="title"
                        value={this.state.search}
                        onChange={this.updateSearch}
                    />
                    {bikeMarkUp.length ? bikeMarkUp : <MessageBox message="No Matching Bikes"/>}
                </section>
            ) : <MessageBox message="No Thefts In Your Area"/>
        )
    }
}

/**
 * A Component that shows the info for a stolen bike.
 * @param {IBikeTheft} stolenBike A stolen bike.
 * @returns {HTMLElement} The markup for the component.
 */
function Bike(stolenBike: IBikeTheft) {
    const propsNew = {} as IBikeTheft;
    for (let x of Object.keys(stolenBike)) {
        propsNew[x] = stolenBike[x] || "N/A"
    }
    return (
        <Card className="bikecard">
            <CardTitle title={propsNew.model} subtitle={propsNew.make}/>
            <CardText>
                <p>
                    <b>Latitude:</b> {propsNew.latitude}
                </p>
                <p>
                    <b>longitude: </b> {propsNew.longitude}
                </p>
                <p>
                    <b>Frame number: </b> {propsNew.frame_number}
                </p>
                <p>
                    <b>Colour: </b> {propsNew.colour}
                </p>
                <p>
                    <b>Description: </b> {propsNew.description}
                </p>
                <p>
                    <b>Reported at: </b> {propsNew.reported_at}
                </p>
            </CardText>
        </Card>
    );
}

