import jsTPS_Transaction from "../../common/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initApp, initId, initOldText, initNewText) {
        super();
        this.app = initApp;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.app.renameItem(this.id, this.newText);
    }
    
    undoTransaction() {
        this.app.renameItem(this.id, this.oldText);
    }
}