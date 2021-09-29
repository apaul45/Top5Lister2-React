import jsTPS_Transaction from "../../common/jsTPS.js"
/* DragAndDropTransaction is the same as ChangeItem_Transaaction, but
for the drag and drop action. 
*/
export default class DragAndDropTransaction extends jsTPS_Transaction{
    //For undo/redo actions, set up old and new list variables
    constructor(initModel, initOldList, initDragIndex, initDropIndex){
        super();
        this.model = initModel;
        this.oldList = initOldList;
        this.dragIndex = initDragIndex;
        this.dropIndex = initDropIndex;
    }
    doTransaction(){
        this.model.dragDropItem(this.dragIndex, this.dropIndex);
    }
    undoTransaction(){
        //Reverse indices to reverse the direction
        this.model.dragDropItem(this.dropIndex, this.dragIndex);
    }
}