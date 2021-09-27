import React from "react";

export default class Statusbar extends React.Component {
    render() {
        const {currentList} = this.props;
        let name = "";
        if (currentList) {
            name = currentList.name;
        }
        return (
            <div id="top5-statusbar">
                {/* Returns a div containing the name of the current list following a load list or edit of list name */}
                {name}
            </div>
        )
    }
}