import React from "react";
export default class Workspace extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editedItems : [-1],
            highlightedItems : [false, false, false, false, false]
        }
    }
    // handleItemEdit(itemId){
    //     let item = document.getElementById("item-" + itemId);
    //     if (this.props.currentList !== null) {
    //         item.draggable = false;
    //         // CLEAR THE TEXT
    //         item.innerHTML = "";
    //         // ADD A TEXT FIELD
    //         let textInput = document.createElement("input");
    //         textInput.setAttribute("type", "text");
    //         textInput.setAttribute("id", "item-text-input-" + itemId);
    //         textInput.setAttribute("value", itemId);

    //         item.appendChild(textInput);
    //         const inputVal = textInput.value;
    //         textInput.value = "";
    //         textInput.value = inputVal;
    //         textInput.onDoubleClick = (event) => {
    //             event.stopPropagation();
    //         }
    //         textInput.onkeydown= (event) => {
    //         textInput.onblur = (event) => {
    //             if (!this.state.enterPressed){
    //                 this.props.changeItemTransaction(itemId, event.target.value);
    //                 item.draggable = true;
    //             }
    //             else{
    //                 this.setState(
    //                     {
    //                         enterPressed : false
    //                     }
    //                 );
    //             }
    //         }
    //     }
    // }
    handleItemEdit(itemId){
        let newEditList = this.state.editedItems;
        newEditList.push(itemId);
        this.setState(
            {
                editedItems : newEditList
        });
    }
    handleKeyPress= (event, itemId)=>{
        if (event.key === 'Enter') {
            let newEditList = this.state.editedItems;
            const arrayIndex = newEditList.indexOf(itemId);
            newEditList.splice(arrayIndex, 1);
            this.setState(
                {
                    editedItems : newEditList
            });
            this.props.changeItemTransaction(this.props.currentList.items[itemId-1],itemId,event.target.value);
        }
    }
    //Blur should dismiss the text box and make the original div re-appear unaffected
    handleBlur= (itemId) => {
        // this.props.changeItemTransaction(itemId, event.target.value);
        let newEditList = this.state.editedItems;
        const arrayIndex = newEditList.indexOf(itemId);
        newEditList.splice(arrayIndex, 1);
        this.setState(
        {
            editedItems : newEditList,
        });
    }
    handleDrop = (event, index) => {
        event.preventDefault();
        //Make sure to turn the new container back to original color once dropped
        let newHighlightedItems = this.state.highlightedItems;
        newHighlightedItems[index] = false;
        this.setState({
            highlightedItems : newHighlightedItems
        });
        this.props.dragDropTransaction();
    }
    handleDragOver = (event, index) => {
        /* Send back the index of this item to App, so that it can 
        be saved as the starting index */
        event.preventDefault();
        this.props.dragOverCallback(index);
    }
    handleDragStart = (event, index) => {
        /* Send back the index of this item to App, so that it can 
        be saved as the starting index */
        this.props.dragStartCallback(event, index);
    }
    //handleDragEnter should turn the droppable target that the dragged target is over green
    handleDragEnter = (index) => {
        let newHighlightedItems = this.state.highlightedItems;
        newHighlightedItems[index] = true;
        this.setState({
            highlightedItems : newHighlightedItems
        });
    }
    //handleDragLeave should turn the backgrd color of this target back to reg color if leaving
    handleDragLeave = (index) => {
        let newHighlightedItems = this.state.highlightedItems;
        newHighlightedItems[index] = false;
        this.setState({
            highlightedItems : newHighlightedItems
        });
    }
    render() {
        const{currentList} = this.props;
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                        {
                        currentList !== null ? 
                        currentList.items.map((item, index) => 
                            this.state.editedItems.includes(index+1) ? 
                            <div id={"item-" + index+1} 
                            className="top5-item" 
                            draggable={"false"} droppable={"false"}>
                                <input type="text" id={"item-" + index+1} 
                                    defaultValue={item} className="top5-item"
                                    onDoubleClick={(e) => e.stopPropagation()} 
                                    onKeyDown={(e) => this.handleKeyPress(e,index+1)} 
                                    onBlur={() => this.handleBlur(index+1)} 
                                    onChange={this.handleChange}/>
                            </div>
                            : <div id={"item-" + index+1} className="top5-item" onDoubleClick={() => this.handleItemEdit(index+1)}
                            draggable={"true"} droppable={"true"}
                            onDragStart={(e) => this.handleDragStart(e, index)} 
                            onDragOver={(e) => this.handleDragOver(e,index)}
                            onDragEnter={() => this.handleDragEnter(index)}
                            onDragLeave={() => this.handleDragLeave(index)}
                            onDrop={(e) => this.handleDrop(e, index)}
                            style={this.state.highlightedItems[index] ? {background:"#669966"} : {background: "#e1e4cb"}}
                            >
                                    {currentList.items[index]}

                            </div>)
                        :
                        ['', '', '','',''].map((item, index) =><div id={"item-" + index+1} className="top5-item" onDoubleClick={() => this.handleItemEdit(index+1)}
                        draggable droppable>
                                {item}
                        </div>)
                        }
                    </div>
                        {/* <div id='item-1' className="top5-item" onDoubleClick={() => this.handleItemEdit(1)}>{currentList!== null ? currentList.items[0] : ""}</div>
                        <div id='item-2' className="top5-item" onDoubleClick={() => this.handleItemEdit(2)}>{currentList!== null ? currentList.items[1] : ""}</div>
                        <div id='item-3' className="top5-item" onDoubleClick={() => this.handleItemEdit(3)}>{currentList!== null ? currentList.items[2] : ""}</div>
                        <div id='item-4' className="top5-item" onDoubleClick={() => this.handleItemEdit(4)}>{currentList!== null ? currentList.items[3] : ""}</div>
                        <div id='item-5' className="top5-item" onDoubleClick={() => this.handleItemEdit(5)}>{currentList!== null ? currentList.items[4] : ""}</div> */}
                </div>
            </div>
        )
    }
}