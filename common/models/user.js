'use strict';

module.exports = function(user) {
    /**
    * Add new user
    * @param {object} user object to add
    * @param {Function(Error, object, string, string)} callback
    */
    user.addNew = (newUser, callback) => {
        user.create(newUser, (error, addedUser) => {
            if (!error) {
                addedUser.userInfo.create({ email: addedUser.email }, (error) => {
                    callback(error, addedUser)
                })
            }
            else {
                callback(JSON.stringify(error))
            }
        })
    }
};
