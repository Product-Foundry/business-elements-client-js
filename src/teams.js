"use strict";

import endpoint from "./endpoint";
import Team from "./team";
import * as requests from "./requests";

/**
 * Abstract representation of organizations.
 */
export default class Teams {

  /**
   * Constructor.
   *
   * @param  {Tenant} tenant         The tenant instance.
   * @param  {Organization} organization     The organization these teams belong to.
   */
  constructor(tenant, organization) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;

    /**
     * The organization which contains these teams.
     * @type {Organization}
     */
    this.organization = organization;
  }

  /**
   * Retrieves the list of teams in the current organization.
   *
   * @param  {Object} options         The options object.
   * @return {Promise<Array<Object>, Error>}
   */
  list(options = {}) {
    return this.tenant.execute({path: endpoint("teams", this.organization.organizationId)}, options)
      // return empty string when response is missing certain fields to help client logic
      .then((response) => {
        if (response && response["_embedded"]) {
          return response["_embedded"]["be:team"];
        } else {
          return [];
        }
      });
  }

  /**
   * Retrieve an team object to perform operations on it.
   *
   * @param  {String} teamId             The id of the team.
   * @return {Team}
   */
  team(teamId) {
    return new Team(this.tenant, this.organization.organizationId, teamId);
  }

  /**
   * Creates the team with the specified properties.
   *
   * @param  {String}  name                 The name of the organization.
   * @param  {Boolean}  isOwnerTeam         True if is the owner team of the organization.
   * @param  {String}  description          The description of the organization.
   * @param  {String}  visibility           The visibility of the organization.
   *
   * @param  {Object} options               The options object.
   * @return {Promise<Object, Error>}
   */
  create(name, description, isOwnerTeam, visibility, options = {}) {
    return this.tenant.execute(
      requests.createTeam(this.organization.organizationId, name, description, isOwnerTeam, visibility),
      options
    );
  }
}
