"use strict";

import * as requests from "./requests";
import Me from "./me";
import endpoint from "./endpoint";

/**
 * Abstract representation of users.
 */
export default class Users {

  /**
   * Constructor.
   *
   * @param  {Tenant} tenant The tenant instance.
   */
  constructor(tenant) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;
  }

  /**
   * Checks if the given email address is available to be used for creating a user.
   *
   * @param  {String}   emailAddress    The email address to check.
   * @param  {Object}   [options]       The options object.
   * @return {Promise<Boolean, Error>}  Indicating if the user email is available.
   */
  isEmailAvailable(emailAddress, options = {}) {
    return this.tenant
      .execute(requests.isEmailAvailable(emailAddress), options)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  /**
   * Creates the user with the specified credentials.
   *
   * @param  {String}   emailAddress     The email address for the user.
   * @param  {String}   [password]       The password for the user.
   * @param  {Object}   [options]        The options object.
   * @return {Promise<Object, Error>}
   */
  create(emailAddress, password, options = {}) {
    return this.tenant.execute(requests.createUser(emailAddress, password), options, true)
      .then((response) => {
        const authenticationToken = response.headers.get("Authentication-Token");
        if (authenticationToken) {
          this.tenant.client.authenticationToken = authenticationToken;
          response.json.authenticationToken = authenticationToken;
        }
        return response.json;
      });
  }

  /**
   * Request for invitation for the user with the specified email.
   *
   * @param  {String}   emailAddress     The email address of the user.
   * @param  {Object}   [options]        The options object.
   * @return {Promise<Object, Error>}
   */
  requestInvitation(emailAddress, options = {}) {
    return this.tenant.execute(requests.requestInvitation(emailAddress), options);
  }

  /**
   * Activates the specified user.
   *
   * @param  {String}   userId           Id of the user to activate.
   * @param  {String}   activationCode   Required to activate the user.
   * @param  {Object}   [options]        The options object.
   * @return {Promise<String, Error>}    With the authentication token.
   */
  activate(userId, activationCode, options = {}) {
    return this.tenant
      .execute(requests.activateUser(userId, activationCode), options, true)
      .then((response) => {
        this.tenant.client.authenticationToken = response.headers.get("Authentication-Token");
        return this.tenant.client.authenticationToken;
      });
  }

  /**
   * Resend activation code for the specified user.
   *
   * @param  {String}   emailAddress           email address of notified user.
   * @param  {Object}   [options]        The options object.
   * @return {Promise<String, Error>}    With the authentication token.
   */
  activationRequest(emailAddress, options = {}) {
    return this.tenant.execute(requests.activationRequest(emailAddress), options, true);
  }

  /**
   * Returns current user information.
   *
   * @return {Me}
   */
  me() {
    return new Me(this.tenant);
  }

  /**
   * Makes a password reset request
   *
   * @param emailAddress
   * @param options
   * @returns {Promise.<Object, Error>}
   */
  passwordResetRequest(emailAddress, options = {}) {
    return this.tenant.execute(requests.passwordResetRequest(emailAddress), options);
  }

  /**
   * Resets the user password to the given value
   *
   * @param userId
   * @param passwordResetCode
   * @param password
   * @param options
   * @return {Promise<String, Error>} With the authentication token.
   */
  passwordReset(userId, passwordResetCode, password, options = {}) {
    return this.tenant
      .execute(requests.passwordReset(userId, passwordResetCode, password), options, true)
      .then((response) => {
        this.tenant.client.authenticationToken = response.headers.get("Authentication-Token");
        return this.tenant.client.authenticationToken;
      });
  }

  /**
   * Returns current user authentications.
   *
   * @param  {Object}   [options]        The options object.
   * @returns {Promise.<Object, Error>}
   */
  listAuthentications(options = {}) {
    return this.tenant.execute(requests.listAuthentications(), options).then((response) => {
      // return empty string when response is missing certain fields to help client logic
      if (response["_embedded"]) {
        return response["_embedded"]["be:authentication"];
      } else {
        return [];
      }
    });
  }

  /**
   * Delete specified authentication.
   *
   * @param authenticationId
   * @param  {Object}   [options]        The options object.
   * @returns {Promise.<Object, Error>}
   */
  deleteAuthentication(authenticationId, options = {}) {
    return this.tenant.execute(requests.deleteAuthentication(authenticationId), options);
  }

  /**
   * Returns email registration status  (NotRegistered, ActivationRequired, NotAuthenticatable, Active).
   *
   * @param emailAddress
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  checkRegistrationStatus(emailAddress, options = {}) {
    return this.tenant.execute(requests.checkRegistrationStatus(emailAddress), options);
  }

  /**
   * Updates the password to the supplied value.
   *
   * @param newPassword
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  changePassword(newPassword, options = {}) {
    return this.tenant.execute(requests.passwordChange(newPassword), options);
  }

  /**
   * Get person details for current user
   *
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  getPerson(options = {}) {
    return this.tenant.execute({path: endpoint("person")}, options);
  }

  /**
   * Get roles
   *
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  getRoles(options = {}) {
    return this.tenant.execute({path: endpoint("roles")}, options).then((response) => {
      if (response["_embedded"]) {
        return response["_embedded"]["be:role"];
      } else {
        return [];
      }
    });
  }

  /**
   * Associate a role to the current user
   *
   * @param roleId
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  addPersonRole(roleId, options = {}) {
    return this.tenant.execute(requests.addPersonRole(roleId), options);
  }

  /**
   * Remove a role from the current user
   *
   * @param roleId
   * @param  {Object}   [options]       The options object.
   * @returns {Promise.<Object, Error>}
   */
  removePersonRole(roleId, options = {}) {
    return this.tenant.execute(requests.removePersonRole(roleId), options);
  }

}
