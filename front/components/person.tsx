import * as React from "react";

export interface IPerson {
    id: number,
    name: string,
    birthday: string,
    is_relative: boolean
}

export class Person extends React.Component<IPerson, {}> {
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