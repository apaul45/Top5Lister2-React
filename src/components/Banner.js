import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title, undoCallback, redoCallback} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar  
                undoCallback={undoCallback}
                redoCallback={redoCallback}
                />
            </div>
        );
    }
}