import * as React from "react";
import {IPerson, Person} from "./person";

/**
 * Defines the state for the People component.
 */
export interface IPeopleState {
    people: IPerson[]
}


/**
 * The people class component.
 */
export class People extends React.Component<{}, IPeopleState> {

    /**
     * Called when the component is instantiated.
     */
    constructor(props: {}) {
        super(props);

        // set the state
        this.state = {
            people: []
        };
    }

    /**
     * Called when the component mounts on the page.
     */
    public componentDidMount() {
        this.fetchData()
    }

    /**
     * The render function returns the markup for the component.
     * @returns {any}
     */
    public render() {
        const people = this.state.people.map(person => <Person key={person.id} {...person} />);

        return (
            <section>
                <h1>People</h1>
                {people}
            </section>
        );
    }

    /**
     * Fetches the data asynchronously and sets the state.
     * @returns {Promise<void>}
     */
    private fetchData = async () => {
        const response = await fetch("/api/people/");
        this.setState({people: await response.json()})
    };
}