import Reflux from 'reflux';

var mockUrl = 'http://localhost:3000/';

var ProjectListActions = Reflux.createActions([
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectsError',
    'loadProjectContents',
    'loadProjectContentsSuccess',
    'handleFloatingErrorInputChange',
    'addProject',
    'addProjectSuccess',
    'addProjectError',
    'showProjectDetails'
]);
ProjectListActions.loadProjects.preEmit = function () {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

ProjectListActions.loadProjectContents.preEmit = function (data) {
    let url = mockUrl + 'db';
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ProjectListActions.loadProjectsSuccess(json.projects)
        }).catch(function(ex) {
            ProjectListActions.loadProjectsError(ex)
        })
};

ProjectListActions.addProject.preEmit = function () {
    fetch(mockUrl + 'projects/', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": document.getElementById('projectNameText').value,
            "description": document.getElementById('projectDescriptionText').value,
            "is_deleted": false
        })
    }).then(function(response) {
            console.log('parsed json', response)
            return response.json()
        }).then(function(json) {
            ProjectListActions.addProjectSuccess()
        }).catch(function(ex) {
            ProjectListActions.addProjectError(ex)
        })
};


export default ProjectListActions;

