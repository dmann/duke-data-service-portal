import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AutoComplete from 'material-ui/lib/auto-complete';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';

class AddFolderModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            open: false,
            parentObj: ProjectStore.parentObj
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                onTouchTap={this.handleFolderButton.bind(this)}/>
        ];

        return (
            <div>
                <RaisedButton
                    label="Add Folder"
                    labelStyle={{color: '#235F9C'}}
                    style={styles.addFolder}
                    onTouchTap={this.openModal.bind(this)}/>
                <Dialog
                    style={styles.dialogStyles}
                    title="Add New Folder"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <form action="#" id="newFolderForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Folder Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Folder Name"
                            id="folderNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                    </form>
                </Dialog>
            </div>
        );
    }

    openModal() {
        this.setState({open: true});
    };

    handleFolderButton() {
        let name = document.getElementById('folderNameText').value;
        if (this.state.floatingErrorText) {
            return null
        } else {
            if (!this.props.entityObj) {
                let id = this.props.params.id;
                let parentKind = 'dds-project';
                ProjectActions.addFolder(id, parentKind, name);
                this.setState({
                    floatingErrorText: 'This field is required.'
                });
            } else {
                let id = this.props.params.id;
                let parentKind = 'dds-folder';
                ProjectActions.addFolder(id, parentKind, name);
                this.setState({
                    floatingErrorText: 'This field is required.'
                });
            }
            this.setState({open: false});
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    };

    handleClose() {
        this.setState({open: false});
    };
}

let styles = {
    addFolder: {
        float: 'right',
        zIndex: '9995',
        position: 'relative',
        margin: '24px 08px 08px 0px',
        textColor: '#235F9C'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

AddFolderModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default AddFolderModal;