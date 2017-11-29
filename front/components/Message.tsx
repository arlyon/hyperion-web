import * as React from "react";

/**
 * The props for the message box.
 */
export interface MessageProps {
    message: string
}

/**
 * A message box component.
 * @param {MessageProps} props The message.
 */
export const MessageBox = (props: MessageProps) => (
    <section className="messagebox">
        <h1>{props.message}</h1>
    </section>
);