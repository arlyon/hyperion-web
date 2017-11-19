import * as React from "react";

export class BikeList extends React.Component <{}, { bikes: any[], search: string }> {
    constructor(props) {
        super(props);
        this.state = {
            bikes: [], //empty string because string ^
            search: "",
        };

        // this.fetchData()
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData() {
        const response = await fetch("/api/bikes/");
        this.setState({bikes: await response.json()})
    }

    updateSearch = (event) => {
        this.setState({search: event.target.value});
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
                } catch {

                }
            }
            return false
        }


        const bikeMarkUp = this.state.bikes
            .filter(bikeFilter) //passes bike as parameter to function BikeFilter
            .map((stolenbike, index) => <article>{stolenbike.make} - {stolenbike.model}</article>);

        return <section>
            <h1> Stolen bikes </h1>
            <input
                type="text"
                value={this.state.search}
                onChange={this.updateSearch}
            />

            {bikeMarkUp}
        </section>
    }
}

