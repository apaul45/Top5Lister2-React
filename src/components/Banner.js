import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title, undoCallback, redoCallback, closeCallback, 
        updateUndo, updateRedo, updateClose} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar  
                undoCallback={undoCallback}
                redoCallback={redoCallback}
                closeCallback={closeCallback}
                updateUndo={updateUndo}
                updateRedo={updateRedo}
                updateClose={updateClose}
                />
            </div>
        );
    }
}