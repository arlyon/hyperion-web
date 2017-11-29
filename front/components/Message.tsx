import * as React from "react";

export const MessageBox = (props: {message: string}) => (
    <section className="messagebox">
        <h1>{props.message}</h1>
    </section>
);