import React from 'react';
import ProjectList from '../components/projectList.jsx';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import ProjectContents from '../components/projectContents.jsx';
import ProjectDetails from '../components/projectDetails.jsx';
import Header from '../components/header.jsx';

class Project extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            loading: false
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectListActions.loadProjectContents();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {

        return (
            <div>
                <ProjectDetails { ...this.state} />
                <ProjectContents { ...this.state } />
            </div>
        );
    }
}

export default Project;