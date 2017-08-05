"use strict";

module.exports = function (context, data) {
    context.log(context.req.headers);
    context.log(data);
    context.bindings.outputQueueItem = [];
    context.bindings.installationQueueItem = []
    context.res = { body: "Ok" };

    const eventtype = context.req.headers["x-github-event"];
    switch (eventtype) {
    case "push":
	context.bindings.outputQueueItem = [{
	    gh: {
		ref: data.ref,
		sha: data.after,
		type: eventtype,
		repository: {
		    name: data.repository.name,
		    owner: {
			login: data.repository.owner.login
		    },
		    clone_url: data.repository.clone_url
		},
		installation: {
		    id: data.installation.id
		}
	    }
	}];
	break;
    case "pull_request":
	if (data.action === "opened" || data.action === "synchronize") {
	    context.bindings.outputQueueItem = [{
		gh: {
		    ref: data.pull_request.head.ref,
		    sha: data.pull_request.head.sha,
		    type: eventtype,
		    clone_url: data.pull_request.head.repo.clone_url,
                    pull_request: {
                        head: {
                            repo: {
                                clone_url: data.pull_request.head.repo.clone_url,
                                owner: { login: data.pull_request.head.repo.owner.login  }
                            }
                        }
                    },
		    repository: {
			name: data.repository.name,
			owner: {
			    login: data.repository.owner.login
			},
			clone_url: data.repository.clone_url
		    },
		    installation: {
			id: data.installation.id
		    }
		}
	    }];
	} else {
	    context.res = { body: "Ignored" };
	}
	break;
    case "installation":
	if (data.action === "created" || data.action === "deleted") {
	    context.bindings.installationQueueItem = [{
		gh: {
		    action: data.action,
		    installation: {
			id: data.installation.id,
			account: {
			    login: data.installation.account.login
			}
		    }
		}
	    }];
	} else {
	    context.res = { body: "Ignored" };
	}
	break;
    default:
	context.res = { body: "Ignored" };
    }
    context.done();
};
