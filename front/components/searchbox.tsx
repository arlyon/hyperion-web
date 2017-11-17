import * as React from "react";
import { Card } from "react-md";

/**
 * The crime class.
 */
export class SearchBox extends React.Component<{}, { searchString: string }> {
    /**
     * Instantiates a new instance of the CrimeList component.
     * @param {{}} props The props (none).
     */
    constructor(props: {}) {
        super(props);

        this.state = {
            searchString: "",
        };
    }

    /**
     * Called when react renders the component to the DOM.
     * @returns {HTMLElement} The html for the component.
     */
    public render() {
        return (
            <Card>
                <h1>Search Box</h1>
                <input type="text" onChange={this.updateSearch} value={this.state.searchString} />
            </Card>
        );
    }

    /**
     * The update search event handler.
     * @param event
     */
    private updateSearch = (event: any) => {
        this.setState({searchString: event.target.value});
    }
}
