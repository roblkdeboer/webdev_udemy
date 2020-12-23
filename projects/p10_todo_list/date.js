
// Exports the data from the function getDate to be used elsewhere
exports.getDate = function () {

    // Response from the server. Can perform logic on the server side
    // For example, can write a message to send depending on what day of the week it is
    const today = new Date();
    const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
    };
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {

    // Response from the server. Can perform logic on the server side
    // For example, can write a message to send depending on what day of the week it is
    const today = new Date();
    const options = {
    weekday: "long",
    };
    return today.toLocaleDateString("en-US", options);

}


