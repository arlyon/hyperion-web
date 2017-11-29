import * as React from "react";
import {ListItem, ListItemProps} from "react-md";

/**
 * Extends the ListItem to also define an href.
 */
interface LinkedListItemProps extends ListItemProps {
    href: string;
    newtab?: boolean;
}

/**
 * A hyperlinked list item.
 */
export const HyperLinkListItem = (props: LinkedListItemProps) => (
    <a
        href={props.href}
        className="hyperlinklist"
        target={props.newtab ? "_blank" : undefined}
    >
        <ListItem {...props} />
    </a>
);