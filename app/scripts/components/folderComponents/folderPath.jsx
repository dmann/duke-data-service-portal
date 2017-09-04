import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { Path } from '../../util/urlEnum';
import FolderOptionsMenu from './folderOptionsMenu.jsx';
import UploadManager from '../globalComponents/uploadManager.jsx';
import BaseUtils from '../../util/baseUtils';
import Card from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';

@observer
class FolderPath extends React.Component {
    
    render() {
        const {entityObj, projPermissions} = mainStore;
        let ancestors = entityObj ? entityObj.ancestors : null;
        let parentKind = entityObj ? entityObj.parent.kind : null;
        let parentId = entityObj ? entityObj.parent.id : null;
        let name = entityObj ? entityObj.name : '';
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let uploadMdl = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            uploadMdl = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <UploadManager {...this.props}/>;
            optionsMenu = prjPrm === 'prjCrud' || prjPrm === 'flCrud' ? optionsMenu = <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity()} /> : null;
        }
        let path = ancestors !== null ? BaseUtils.getFilePath(ancestors) : '';
        return (
            <Card className="project-container group mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                  style={{overflow: 'visible', padding: '10px 0px 10px 0px'}}>
                { uploadMdl }
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={'/#/' + BaseUtils.getUrlPath(parentKind) + parentId } className="mdl-color-text--grey-800 external" onTouchTap={() => this.goBack()}>
                            <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>
                            Back
                        </a>
                        <div style={styles.menuIcon}>
                            { optionsMenu }
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={styles.detailsTitle}>
                        <h4 style={styles.heading}><FontIcon className="material-icons" style={styles.folderIcon}>folder_open</FontIcon>{ name }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.breadcrumbs}>
                        <h6 style={styles.breadcrumbHeading}>{path}  {' '+name}</h6>
                    </div>
                </div>
            </Card>
        );
    }

    goBack() {
        mainStore.showBackButton ? this.props.router.goBack() : null;
    }

    setSelectedEntity() {
        let id = this.props.params.id;
        let isListItem = false;
        mainStore.setSelectedEntity(id, Path.FOLDER, isListItem);
    }
}

const styles = {
    arrow: {
        textAlign: 'left'
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -7
    },
    breadcrumbs: {
        float: 'left'
    },
    breadcrumbHeading: {
        margin: '0px 0px 6px 3px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    folderIcon: {
        fontSize: 36,
        verticalAlign: 'text-bottom',
        marginRight: 8,
        color: Color.dkGrey
    },
    heading: {
        margin: 0,
        fontWeight: 200
    },
    menuIcon: {
        float: 'right',
        marginTop: -10,
        marginRight: -12
    }
};

FolderPath.propTypes = {
    entityObj: object,
    projPermissions: object
};

export default FolderPath;