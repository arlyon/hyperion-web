import * as React from "react";
import {Card, CardText, CardTitle, TextField} from 'react-md';
import {IBikeTheft} from '../interfaces/BikeTheft'
import {MessageBox} from "./Message";

interface IBikeListProps {
    bikes: IBikeTheft[] | null,
}

/**
 * Given a postcode, fetches a list of stolen bikes nearby.
 */
export class BikeList extends React.Component<IBikeListProps, { search: string }> {

    constructor(props: IBikeListProps) {
        super(props);

        this.state = {
            search: "",
        };
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

        const bikeMarkUp = this.props.bikes?.filter(bikeFilter)
            .map((stolenBike, index) => <Bike key={index} {...stolenBike} />);

        return (
            this.props.bikes?.length ? (
                <>
                    <TextField
                        id="bikefilter"
                        placeholder={`Search ${this.props.bikes.length} bikes...`}
                        customSize="title"
                        value={this.state.search}
                        onChange={this.updateSearch}
                        style={{margin: '2em'}}
                    />
                    <section className="bikecontainer">
                        {bikeMarkUp?.length ? bikeMarkUp : <MessageBox message="No Matching Bikes Thefts"/>}
                    </section>
                </>
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
    return (
        <article className="md-paper md-paper--1 bikecard">
            <header>
                <h2>{stolenBike.model}</h2>
                <h3>{stolenBike.make}</h3>
            </header>
            <CardText style={{flexGrow: 1}}>
                <p>
                    <b>Frame number: </b> {stolenBike.frame_number}
                </p>
                <p>
                    <b>Colour: </b> {stolenBike.colour || "N/A"}
                </p>
                <p>
                    <b>Description: </b> {stolenBike.description || "None"}
                </p>
            </CardText>
            <footer>
                <a href={`http://maps.google.com/maps?q=${stolenBike.latitude},${stolenBike.longitude}`}>
                    <pre>{`[${stolenBike.latitude}, ${stolenBike.longitude}]`}</pre>
                </a>
                <p>{stolenBike.reported_at ? `Reported ${stolenBike.reported_at}` : <br/>}</p>
            </footer>
        </article>
    );
}

