"use strict";

const mut = require("./index.js");

let context = {
    log: console.log,
    done: function() {
	console.log("Response:", this.res, "\nOutput:", this.bindings);
    },
    req: {
        headers: { "x-github-event": "unknown" }
    },
    bindings: {
	outputQueueItem: null
    },
    res: null
};

console.log("Test unknown type of request");
mut(context, {});

const pushdata = {
    ref: "refs/heads/master",
    after: "5496a3e0a144c0fb2ce34dfb1255444178cd8df0",
    repository: {
        name: "meta-ros",
        owner: { login: "rojkov" },
	clone_url: "https://github.com/rojkov/meta-ros.git"
    },
    installation: {
	id: 45679
    }
};

context.req.headers["x-github-event"] = "push";
console.log("Test `git push`");
mut(context, pushdata);

console.log("Test 'pull_request'");
context.req.headers["x-github-event"] = "pull_request";
const pullrequestdata = {
    action: "opened",
    pull_request: {
	head: {
	    ref: "roscpp-532",
	    sha: "6b4a2306ec1dc6ea823d032eabb26b8fbf90956f",
	    repo: {
		clone_url: "https://github.com/bbcibot/meta-ros.git",
                owner: { login: "bbcibot" }
	    }
	}
    },
    repository: {
        name: "meta-ros",
        owner: { login: "rojkov" },
	clone_url: "https://github.com/rojkov/meta-ros.git"
    },
    installation: {
	id: 45679
    }
};
mut(context, pullrequestdata);

console.log("Test 'installation'");
context.req.headers["x-github-event"] = "installation";
const installationdata = {
    action: "created",
    installation: {
        id: 45678,
        account: {
            login: "rojkov"
        }
    }
};
mut(context, installationdata);

console.log("Test unhandled pull_request actions");
pullrequestdata.action = "unknown";
mut(context, pullrequestdata);
