import jsTPS_Transaction from "../../common/jsTPS.js"
/* DragAndDropTransaction is the same as ChangeItem_Transaaction, but
for the drag and drop action. 
*/
export default class DragAndDropTransaction extends jsTPS_Transaction{
    //For undo/redo actions, set up old and new list variables
    constructor(initApp, initDragIndex, initDropIndex){
        super();
        this.app = initApp;
        this.dragIndex = initDragIndex;
        this.dropIndex = initDropIndex;
    }
    doTransaction(){
        let itemList = ["","","","",""];
        if (this.app.state.currentList !== null){
            itemList = this.app.db.queryGetList(this.app.state.currentList.key).items;
        }
        itemList.splice(this.dropIndex, 0, itemList.splice(this.dragIndex, 1)[0]);
        this.app.executeDragDrop(itemList);
    }
    undoTransaction(){
        let itemList = ["","","","",""];
        if (this.app.state.currentList !== null){
            itemList = this.app.db.queryGetList(this.app.state.currentList.key).items;
        }
        itemList.splice(this.dragIndex, 0, itemList.splice(this.dropIndex, 1)[0]);
        this.app.executeDragDrop(itemList);
    }
}