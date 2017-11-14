import * as React from "react";


/*
 * Here are two different ways of creating components.
 *  - Class based component
 *  - function-based component
 *
 *  Components with state have to be class based.
 */


/**
 * The IPerson interface that defines
 * the properties for a person.
 */
export interface IPerson {
    id: number,
    name: string,
    birthday: string,
    is_relative: boolean
}

/**
 * A stateless, classless component.
 * @param {IPerson} props
 * @constructor
 */
export const Person = (props: IPerson) =>
    <article>
        <h1>{props.name}</h1>
        <dl>
            <dt>Born at</dt>
            <dd>{props.birthday}</dd>
            <dt>Relative</dt>
            <dd>{props.is_relative.toString()}</dd>
        </dl>
    </article>;

/**
 * A class-based component.
 */
export class Person2 extends React.Component<IPerson, {}> {
    public render() {
        return (
            <article>
                <h1>{this.props.name}</h1>
                <dl>
                    <dt>Born</dt>
                    <dd>{this.props.birthday}</dd>
                    <dt>Relative</dt>
                    <dd>{this.props.is_relative.toString()}</dd>
                </dl>
            </article>
        )
    }
}