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