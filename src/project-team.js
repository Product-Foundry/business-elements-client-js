"use strict";

import * as requests from "./requests";
import endpoint from "./endpoint";

/**
 * Abstract representation of a project team.
 */
export default class ProjectTeam {

  /**
   * Constructor.
   *
   * @param  {Tenant}              tenant     The tenant instance.
   * @param  {OrganizationProject} project    The project instance.
   * @param  {String}  teamId      The team id.
   */
  constructor(tenant, project, teamId) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;

    /**
     * The project.
     * @type {Project}
     */
    this.project = project;

    /**
     * The team id.
     * @type {String}
     */
    this.teamId = teamId;
  }

  /**
   * Retrieves project team.
   *
   * @param  {Object} options         The options object.
   * @return {Promise<Object, Error>}
   */
  get(options = {}) {
    return this.tenant.execute({
      path: endpoint(
        "organizationProjectTeam",
        this.project.organization.organizationId,
        this.project.projectId,
        this.teamId
      )
    }, options);
  }

  /**
   * Updates current project team
   *
   * @param {String} permission           Project team permission
   * @param  {Object} options             The options object.
   * @returns {Promise.<Object, Error>}
   */
  edit(permissions, options = {}) {
    return this.tenant.execute(
      requests.editProjectTeam(
        this.project.organization.organizationId,
        this.project.projectId,
        this.teamId, permissions
      ),
      options
    );
  }

  /**
   * Delete current team
   *
   * @param  {Object} options             The options object.
   * @returns {Promise.<Object, Error>}
   */
  remove(options = {}) {
    return this.tenant.execute(
      requests.deleteProjectTeam(
        this.project.organization.organizationId,
        this.project.projectId,
        this.teamId
      ),
      options
    );
  }
}
