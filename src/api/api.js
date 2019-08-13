var baseUrl = "http://malltest.95598gd.com/nwjcrb/api/jira"
var api = {
    jira: {
        index: baseUrl + "/index",
        bugList: baseUrl + "/bugList",
        bugDetail: baseUrl + "/bugDetail",
        getAttach: baseUrl + "/getAttach",
    }
}
module.exports = api.jira