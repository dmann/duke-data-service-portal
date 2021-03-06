import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../stores/authStore';
import agentStore from '../stores/agentStore';
import mainStore from '../stores/mainStore';
import navigatorStore from '../stores/navigatorStore';
import TreeList from '../components/navigatorComponents/treeList.jsx';
import Breadcrumbs from '../components/navigatorComponents/breadcrumbs.jsx';
import ListItems from '../components/navigatorComponents/listItems.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx'
import VersionUpload from '../components/fileComponents/versionUpload.jsx';
import { UrlGen, Path } from '../util/urlEnum';

@observer
class Navigator extends React.Component {
    componentDidMount() {
        const { leftMenuDrawer, projects } = mainStore;
        let params = this.props.params;
        if(!projects.length) mainStore.getProjects(null, null, true);
        if(leftMenuDrawer.get('open')) mainStore.toggleLeftMenuDrawer();
        if(params && params.id) {
            navigatorStore.clearListItems();
        }
        this.loadItems();
    }

    componentDidUpdate(prevProps) {
        let params = this.props.params;
        if(params && prevProps && prevProps.params && prevProps.params.id !== params.id) {
            navigatorStore.clearListItems();
            this.loadItems();
        }
    }

    loadItems() {
        let pathname = this.props.router.location.pathname;
        if (pathname === UrlGen.pathname.home()) {
            this._loadProjects();
        } else if (pathname === UrlGen.pathname.navigatorHome()) {
            this._loadProjects();
        } else if (pathname.includes(UrlGen.pathname.navigatorProject())) {
            this._loadProjectChildren();
        } else if (pathname.includes(UrlGen.pathname.navigatorFolder())) {
            this._loadFolderChildren();
        } else if (pathname.includes(UrlGen.pathname.agents())) {
            this._loadAgents();
        }
    }

    _loadAgents() {
        if(authStore.userKey.key) authStore.getUserKey();
        if(!authStore.currentUser) authStore.getCurrentUser();
        agentStore.getAgents();
    }

    _loadProjects() {
        navigatorStore.setSelectedItem(null);
    }

    _loadProjectChildren() {
        let path = Path.PROJECT;
        let params = this.props.params;
        mainStore.getEntity(params.id, path);
        navigatorStore.setSelectedItem(params.id, path);
        mainStore.getChildren(params.id, path);
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        mainStore.getUser(params.id);
    }

    _loadFolderChildren() {
        let path = Path.FOLDER;
        let params = this.props.params;
        mainStore.getEntity(params.id, path);
        navigatorStore.setSelectedItem(params.id, path);
        mainStore.getChildren(params.id, path);
        mainStore.clearSelectedItems(); // Clear checked files and folders from list
        if(mainStore.filesChecked || mainStore.foldersChecked) mainStore.handleBatch([],[]);
    }

    render() {
        return (
            <div style={styles.main}>
                <TreeList {...this.props} />
                <div style={this.bodyStyle()}>
                    <Breadcrumbs {...this.props} />
                    <ListItems {...this.props} />
                    <TagManager {...this.props} />
                    <VersionUpload {...this.props} />
                </div>
            </div>
        );
    }

    bodyStyle() {
        const {drawer} = navigatorStore;
        let style = {};
        if(window.innerWidth > 720) {
            style.marginLeft = drawer.get('open') ? drawer.get('width') : 0
        }
        return style;
    };
}

const styles = {
    main: {
        marginTop: '-20px'
    }
};

export default Navigator;