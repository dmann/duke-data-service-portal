import Reflux from 'reflux';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import ProjectStore from '../stores/projectStore';
import urlGen from '../../util/urlGen.js';
import appConfig from '../config';
import StatusEnum from '../enum';
import { checkStatus, getAuthenticatedFetchParams } from '../../util/fetchUtil.js';

var ProjectActions = Reflux.createActions([
    'batchDelete',
    'closeErrorModal',
    'getUser',
    'getUserSuccess',
    'getUsageDetails',
    'getUsageDetailsSuccess',
    'handleErrors',
    'loadProjects',
    'loadProjectsSuccess',
    'loadProjectChildren',
    'loadProjectChildrenSuccess',
    'addProject',
    'addProjectSuccess',
    'deleteProject',
    'deleteProjectSuccess',
    'editProject',
    'editProjectSuccess',
    'showDetails',
    'showDetailsSuccess',
    'loadFolderChildren',
    'loadFolderChildrenSuccess',
    'addFolder',
    'addFolderSuccess',
    'deleteFolder',
    'deleteFolderSuccess',
    'editFolder',
    'editFolderSuccess',
    'addFile',
    'addFileSuccess',
    'deleteFile',
    'deleteFileSuccess',
    'editFile',
    'editFileSuccess',
    'getEntity',
    'getEntitySuccess',
    'getProjectMembers',
    'getProjectMembersSuccess',
    'getUserName',
    'getUserNameSuccess',
    'getUserId',
    'getUserIdSuccess',
    'addProjectMember',
    'addProjectMemberSuccess',
    'deleteProjectMember',
    'deleteProjectMemberSuccess',
    'getDownloadUrl',
    'getDownloadUrlSuccess',
    'showBatchOptions',
    'startUpload',
    'startUploadSuccess',
    'updateChunkProgress',
    'updateAndProcessChunks',
    'allChunksUploaded',
    'uploadError',
    'getChunkUrl'
]);

ProjectActions.getUser.preEmit = () => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'current_user', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            return response.json()
        }).then(function (json) {
            ProjectActions.getUserSuccess(json)
        })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUsageDetails.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'current_user/usage', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUsageDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.loadProjects.preEmit = function () {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadProjectsSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.loadProjectChildren.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadProjectChildrenSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.showDetails.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.showDetailsSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addProject.preEmit = function (name, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Added');
        ProjectActions.addProjectSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Failed to add new project');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteProject.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast('Project Deleted');
        ProjectActions.deleteProjectSuccess(json)
    }).catch(function (ex) {
        MainActions.addToast('Project Delete Failed');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editProject.preEmit = function (id, name, desc) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "description": desc
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Project Updated');
        ProjectActions.editProjectSuccess()
    }).catch(function (ex) {
        MainActions.addToast('Project Update Failed');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.loadFolderChildren.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'folders/' + id + '/children', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.loadFolderChildrenSuccess(json.results)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.addFolder.preEmit = function (id, parentKind, name) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'folders/', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "parent": {
                "kind": parentKind,
                "id": id
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Added');
        ProjectActions.addFolderSuccess(id, parentKind);
    }).catch(function (ex) {
        MainActions.addToast('Failed to Add a New Folder');
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.deleteFolder.preEmit = function (id, parentId, parentKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'folders/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('Folder Deleted!');
        ProjectActions.deleteFolderSuccess(parentId, parentKind)
    }).catch(function (ex) {
        MainActions.addToast('Folder Deleted Failed!');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editFolder.preEmit = function (id, name) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'folders/' + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('Folder Updated!');
        ProjectActions.editFolderSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update Folder');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.deleteFile.preEmit = function (id, parentId, parentKind) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'files/' + id, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function () {
        MainActions.addToast('File Deleted!');
        ProjectActions.deleteFileSuccess(parentId, parentKind)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Delete File!');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.editFile.preEmit = function (id, fileName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'files/' + id + '/rename', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "name": fileName
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast('File Updated!');
        ProjectActions.editFileSuccess(id)
    }).catch(function (ex) {
        MainActions.addToast('Failed to Update File');
        ProjectActions.handleErrors(ex)
    });
};

ProjectActions.getEntity.preEmit = (id, kind) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + kind + '/' + id, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getEntitySuccess(json)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getProjectMembers.preEmit = (id) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id + '/permissions', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getProjectMembersSuccess(json.results)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getUserName.preEmit = (text) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + text , {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUserNameSuccess(json.results)
    })
        .catch(function (ex) {
            console.log('Error occurred while filling autocomplete field');
        });
};

ProjectActions.getUserId.preEmit = (fullName, id, role) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'users?' + 'full_name_contains=' + fullName, {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getUserIdSuccess(json.results, id, role)
    })
        .catch(function (ex) {
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.addProjectMember.preEmit = (id, userId, role, name) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id + '/permissions/' + userId, {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'auth_role': {'id': role}
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(name + ' ' + 'has been added to this project');
        ProjectActions.addProjectMemberSuccess(id)
    })
        .catch(function (ex) {
            MainActions.addToast('Could not add member to this project or member does not exist');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.deleteProjectMember.preEmit = (id, userId, userName) => {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + id + '/permissions/' + userId, {
        method: 'delete',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
    }).then(function (json) {
        MainActions.addToast(userName + ' ' + 'has been removed from this project');
        ProjectActions.deleteProjectMemberSuccess(id, userId);
    })
        .catch(function (ex) {
            MainActions.addToast('Unable to remove ' + userName + ' from this project');
            ProjectActions.handleErrors(ex)
        });
};

ProjectActions.getDownloadUrl.preEmit = function (id) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'files/' + id + '/url', {
        method: 'get',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.getDownloadUrlSuccess(json)
    }).catch(function (ex) {
        ProjectActions.handleErrors(ex)
    })
};

ProjectActions.startUpload.preEmit = function (projId, blob, parentId, parentKind) {
    let chunkNum = 0,
        fileName = blob.name,
        contentType = blob.type,
        slicedFile = null,
        BYTES_PER_CHUNK, SIZE, NUM_CHUNKS, start, end;
    BYTES_PER_CHUNK = 5242880;
    SIZE = blob.size;
    NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    start = 0;
    end = BYTES_PER_CHUNK;

    var fileReader = new FileReader();

    let details = {
        name: fileName,
        size: SIZE,
        blob: blob,
        parentId: parentId,
        parentKind: parentKind,
        uploadProgress: 0,
        chunks: []
    };
    // describe chunk details
    while (start <= SIZE) {
        slicedFile = blob.slice(start, end);
        details.chunks.push({
            number: chunkNum,
            start: start,
            end: end,
            chunkUpdates: {
                status: null,
                progress: 0
            },
            retry: 0
        });
        // increment to next chunk
        start = end;
        end = start + BYTES_PER_CHUNK;
        chunkNum++;
    }
    fileReader.onload = function (event, files) {
        // create project upload
        fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'projects/' + projId + '/uploads', {
            method: 'post',
            headers: {
                'Authorization': appConfig.apiToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'name': fileName,
                'content_type': contentType,
                'size': SIZE
            })
        }).then(checkResponse).then(function (response) {
            return response.json()
        }).then(function (json) {
            let uploadObj = json;
            if (!uploadObj || !uploadObj.id) throw "Problem, no upload created";
            ProjectActions.startUploadSuccess(uploadObj.id, details);
        }).catch(function (ex) {
            ProjectActions.handleErrors(ex)
        })
    };
    fileReader.onerror = function (e) {
        ProjectActions.handleErrors();
        console.log("error", e);
        console.log(e.target.error.message);
    };
    fileReader.readAsArrayBuffer(slicedFile);
};

ProjectActions.getChunkUrl.preEmit = function (uploadId, chunkBlob, chunkNum, size, parentId, parentKind, fileName, chunkUpdates) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var arrayBuffer = event.target.result;
        var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        var md5crc = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
        fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'uploads/' + uploadId + '/chunks', {
            method: 'put',
            headers: {
                'Authorization': appConfig.apiToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "number": chunkNum,
                "size": chunkBlob.size,
                'hash': {
                    'value': md5crc,
                    'algorithm': 'MD5'
                }
            })

        }).then(checkResponse).then(function (response) {
            return response.json()
        }).then(function (json) {
            let chunkObj = json;
            if (chunkObj && chunkObj.url && chunkObj.host) {
                // upload chunks
                uploadChunk(uploadId, chunkObj.host + chunkObj.url, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates)
            } else {
                throw 'Unexpected response';
            }
        }).catch(function (ex) {
            ProjectActions.updateAndProcessChunks(uploadId, chunkNum, {status: StatusEnum.STATUS_RETRY});
        });
    };
    fileReader.readAsArrayBuffer(chunkBlob);
};

function uploadChunk(uploadId, presignedUrl, chunkBlob, size, parentId, parentKind, chunkNum, fileName, chunkUpdates) {
    window.addEventListener('offline', function () {
        ProjectActions.uploadError(uploadId, fileName)
    });
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = uploadProgress;
    function uploadProgress(e) {
        if (e.lengthComputable) {
            ProjectActions.updateChunkProgress(uploadId, chunkNum, e.loaded/e.total * (chunkBlob.size));
        }
    }

    xhr.onload = onComplete;
    function onComplete() {
        let status = null;
        if (xhr.status >= 200 && xhr.status < 300) {
            chunkUpdates.status = StatusEnum.STATUS_SUCCESS;
        }
        else {
            chunkUpdates.status = StatusEnum.STATUS_RETRY;
        }
        ProjectActions.updateAndProcessChunks(uploadId, chunkNum, {status: chunkUpdates.status});
    }

    xhr.open('PUT', presignedUrl, true);
    xhr.send(chunkBlob);
};

ProjectActions.allChunksUploaded.preEmit = function (uploadId, parentId, parentKind, fileName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'uploads/' + uploadId + '/complete', {
        method: 'put',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        }
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        ProjectActions.addFile(uploadId, parentId, parentKind, fileName);
    }).catch(function (ex) {
        ProjectActions.uploadError(uploadId, fileName);
    })
};

ProjectActions.addFile.preEmit = function (uploadId, parentId, parentKind, fileName) {
    fetch(urlGen.routes.baseUrl + urlGen.routes.apiPrefix + 'files/', {
        method: 'post',
        headers: {
            'Authorization': appConfig.apiToken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'parent': {
                'kind': parentKind,
                'id': parentId
            },
            'upload': {
                'id': uploadId
            }
        })
    }).then(checkResponse).then(function (response) {
        return response.json()
    }).then(function (json) {
        MainActions.addToast(fileName + ' uploaded successfully');
        ProjectActions.addFileSuccess(parentId, parentKind, uploadId)
    }).catch(function (ex) {
        MainActions.addToast('Failed to upload ' + fileName + '!');
        ProjectActions.handleErrors(ex)
    })
};

function checkResponse(response) {
    return checkStatus(response, MainActions);
}

export default ProjectActions;