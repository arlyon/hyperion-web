import * as React from "react";
import {Card, CardTitle, CardText} from 'react-md';

export class BikeList extends React.Component <{ postcode }, { bikes: any[], search: string }> {
    constructor(props: {postcode}) {
        super(props);
        this.state = {
            bikes: [], //empty string because string ^
            search: "",
        };

        //this.fetchData()
    }

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
        const response = await fetch(`/api/bikes/${postcode}`);
        this.setState({bikes: await response.json()})
    }

    updateSearch = (value: string) => {
        this.setState({search: value});
    };

    render() {

        const bikeFilter = (bike): boolean => {
            if (this.state.search === "") {
                return true; //Display all if search is empty
            }

            for (let key of Object.keys(bike)) {
                try {
                    if (bike[key].toLowerCase().includes(this.state.search)) {
                        return true;
                    }
                } catch (Exception) {}
            }
            return false
        };
        const bikeMarkUp = this.state.bikes
            .filter(bikeFilter) //passes bike as parameter to function BikeFilter
            .map((stolenBike, index) => <CardForBikes  key={index} {...stolenBike} />);

        const style = {
            marginTop: "3em",
            display: "flex" as "flex",
            flexDirection: "row" as "row",
            flexWrap: "wrap" as "wrap",
            justifyContent: "center" as "center",
        };

        return (
            <section style={style}>
                {bikeMarkUp}
            </section>
        )
    }
}

interface IBikeTheft {
    make?: string,
    model?: string,
    colour?: string,
    latitude?: number,
    longitude?: number,
    frame_number?: string | null,
    rfid?: string | null,
    description?: null | string,
    reported_at?: string | null,

}

function CardForBikes(props: IBikeTheft) {
    const style = {maxWidth: 320, minWidth: 320};
    const propsNew = {} as IBikeTheft;
    for (let x of Object.keys(props)) {
        propsNew[x] = props[x] || "N/A"
    }
    return (
        <Card style={style}>
            <CardTitle title={propsNew.model} subtitle={propsNew.make}/>
            <CardText>
                <article><b>
                    Latitude:</b> {propsNew.latitude}
                </article>
                <article><b>
                    longitude: </b> {propsNew.longitude}
                </article>
                <article><b>
                    Frame number: </b> {propsNew.frame_number}
                </article>
                <article><b>
                    Colour: </b> {propsNew.colour}
                </article>
                <article><b>
                    Description: </b> {propsNew.description}
                </article>
                <article><b>
                    Reported at: </b> {propsNew.reported_at}
                </article>
            </CardText>
        </Card>
    );
}

