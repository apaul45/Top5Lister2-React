import React from 'react';
import './App.css';
import ChangeItem_Transaction from './components/transactions/ChangeItem_Transaction.js';
import DragAndDropTransaction from './components/transactions/DragDropItem_Transaction.js';
import jsTPS from './common/jsTPS.js';
// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        //This will keep track of the transaction stack
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();
        console.log(loadedSessionData.nextKey);

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            //The currentDeleteList attribute contains the pair whos delete button was clicked
            //This will be updated in deleteList so that its name can be rendered correctly in deleteModal
            currentDeleteList : null
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        console.log(newKey);
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };
        console.log(newList);
        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
        });
    }

    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    addChangeItemTransaction = (oldText, id, newText) => {
        // GET THE CURRENT TEXT
        let transaction = new ChangeItem_Transaction(this, id, oldText, newText);
        //Add the transaction to the transaction stack
        this.tps.addTransaction(transaction);
    }
    renameItem = (id, newName) => {
        if (this.state.currentList != null){
            let newItemList = this.db.queryGetList(this.state.currentList.key);
            newItemList.items[id-1] = newName;
            let newKeyNamePair = [...this.state.sessionData.keyNamePairs];
            newKeyNamePair.map((pair) => pair.key !== this.state.currentList.key ? pair : pair = newItemList);
            //use SetState to update the items on the ui & cause a re-render
            this.setState(prevState => ({
                currentList: newItemList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePair
                }
            }), () => {
                //Then use after effect to save all changes to local storage using mutationUpdateSessionData
                this.db.mutationUpdateList(this.state.currentList);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        }
    }
    undo(){
        this.tps.undoTransaction();
    }
    redo(){
        this.tps.doTransaction();
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        console.log(newCurrentList);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            this.tps.clearAllTransactions();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            this.tps.clearAllTransactions();
        });
    }
    deleteList = (pair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        
        //Before making the delete modal div visible, update the currentDeleteList
        //state attribute to be the pair who's delete button was clicked on
        this.setState(prevState => ({
            //Changing the currentDeleteList will cause all components to re render,
            //meaning that DeleteModal will re render to include the right pair that can be used to 
            //display the name 
            currentDeleteList : pair
        }));
        console.log(this.state.sessionData.nextKey);
        this.showDeleteListModal();
    }
    deleteSelectedList = () => {
        //let key = (this.state.currentDeleteList != null) ? this.state.currentDeleteList.key : -1;
        if (this.state.currentDeleteList != null){
            let key = this.state.currentDeleteList.key;
            //Update the session data to filter out the confirmed list to delete, and then sort it
            let updatedPairs = this.state.sessionData.keyNamePairs.filter(list => list.key !== key);
            console.log(updatedPairs);
            console.log(this.state.sessionData.nextKey);
            console.log(this.state.sessionData.counter);
            this.sortKeyNamePairsByName(updatedPairs);
            //Set the new session data variable to the filtered out list
            //This set state will then automatically call render() and upate the ui
            this.setState(prevState => ({
                sessionData: {
                    keyNamePairs: updatedPairs,
                    counter: prevState.sessionData.counter - 1,
                    nextKey : prevState.sessionData.nextKey
                }
            }), () => {
                //Save the changes to the current session data to local storage using mutationUpdateSessionData
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
            this.hideDeleteListModal();
        }
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} 
                    undoCallback = {this.undo}
                    redoCallback = {this.redo}
                    />
                {/* In sidebar, each of the list divs are stored with their
                keyname pairs, delete buttons, create buttons, and more */}
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    changeItemTransaction = {this.addChangeItemTransaction}
                    />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    pair = {this.state.currentDeleteList} 
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteSelectedListCallback = {this.deleteSelectedList}
                />
            </div>
        );
    }
}

export default App;
