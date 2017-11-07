import * as React from "react";
import {IPerson, Person} from "./person";

export interface PeopleState {
    people: IPerson[]
}

export class People extends React.Component<{}, PeopleState> {
    constructor() {
        super();
        this.state = {
            people: []
        };

        this.fetchData()
    }

    fetchData = async () => {

        const response = await fetch("/api/people/");

        this.setState({people: await response.json()})
    };

    render() {
        const people = this.state.people.map(person => {
            return <Person key={person.id} {...person} />
        });

        return (
            <section>
                <h1>People</h1>
                {people}
            </section>
        );
    }
}