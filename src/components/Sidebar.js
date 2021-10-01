import React from "react";
import ListCard from "./ListCard";
//This component handles the mapping/appearance of each list on the sidebar 
export default class Sidebar extends React.Component {
    render() {
        const { heading,
                currentList,
                keyNamePairs,
                createNewListCallback, 
                deleteListCallback, 
                loadListCallback,
                renameListCallback,
                addFoolproof} = this.props;
        return (
            <div id="top5-sidebar">
                {/* Div containing the add list */}
                <div id="sidebar-heading">
                    <input 
                        type="button" 
                        id="add-list-button" 
                        onClick={createNewListCallback}
                        className="top5-button" 
                        value='+'
                        style={!addFoolproof ? {backgroundColor: "lightgray"} : {backgroundColor: "white"}}/>
                    {heading}
                </div>
                <div id="sidebar-list">
                {
                    //This div maps each of the keyNamePairs to their own div:
                    //its propagates down all the necessary info about loading, editing, and deleting the list to 
                    //the specific listcard div
                    keyNamePairs.map((pair) => (
                        <ListCard
                            key={pair.key}
                            keyNamePair={pair}
                            selected={(currentList !== null) && (currentList.key === pair.key)}
                            deleteListCallback={deleteListCallback}
                            loadListCallback={loadListCallback}
                            renameListCallback={renameListCallback}
                        />
                    ))
                }
                </div>
            </div>
        );
    }
}