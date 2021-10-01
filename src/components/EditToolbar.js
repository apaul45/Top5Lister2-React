import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const {undoCallback, redoCallback, closeCallback, 
        updateRedo, updateUndo, updateClose} = this.props;
        return (
            <div id="edit-toolbar">
                <div
                    id='undo-button' 
                    className={!updateUndo ? "top5-button disabled" : "top5-button"}
                    onClick={undoCallback}>
                    &#x21B6;
                </div>
                <div
                    id='redo-button'
                    onClick={redoCallback}
                    className={!updateRedo ? "top5-button disabled" : "top5-button"}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    onClick={closeCallback}
                    className={!updateClose ? "top5-button disabled" : "top5-button"}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}