import * as React from "react";

const style = {
    display: "flex" as "flex",
    justifyContent: "center" as "center",
    alignItems: "center" as "center",
    minHeight: "20em",
    width: "100%"
};

const headerStyle = {
    fontWeight: "bold" as "bold",
    color: "rgba(0,0,0,0.8)"
}

export const MessageBox = (props: {message: string}) => (
    <div style={style}>
        <h1 style={headerStyle}>{props.message}</h1>
    </div>
);