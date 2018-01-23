'use strict';

module.exports = function(Account) {
    /**
    * Add new account
    * @param {object} user Teacher object to add
    * @param {Function(Error, object, string, string)} callback
    */
    Account.addNew = (account, callback) => {
        Account.create(account, (error, newAccount) => {
            if (!error) {
                newAccount.userInfo.create({ email: newAccount.email }, (error) => {
                    callback(error, newAccount)
                })
            }
        })
    }
};
