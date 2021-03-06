"use strict";

import endpoint from "./endpoint";
import * as requests from "./requests";
import ProjectContexts from "./project-contexts";
import Teams from "./teams";
import ProjectInstances from "./project-instances";

/**
 * Abstract representation of a project.
 */
export default class Project {

  /**
   * Constructor.
   *
   * @param  {Tenant} tenant     The tenant instance.
   * @param  {String} projectId  The project id.
   */
  constructor(tenant, projectId) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;

    /**
     * The project id.
     * @type {String}
     */
    this.projectId = projectId;
  }

  /**
   * Retrieves project.
   *
   * @param  {Object} options         The options object.
   * @return {Promise<Object, Error>}
   */
  get(options = {}) {
    return this.tenant.execute(
      {
        path: endpoint("project", this.projectId)
      },
      options
    );
  }

  /**
   * Updates current project
   *
   * @param {String} name                 Project name
   * @param {String} description          Project description
   * @param  {Object} options             The options object.
   * @returns {Promise.<Object, Error>}
   */
  edit(name, description, options = {}) {
    return this.tenant.execute(
      requests.editProject(this.projectId, name, description),
      options
    );
  }

  /**
   * Delete current project
   *
   * @param  {Object} options             The options object.
   * @returns {Promise.<Object, Error>}
   */
  remove(options = {}) {
    return this.tenant.execute(
      requests.deleteProject(this.projectId),
      options
    );
  }

  teams() {
    return new Teams(this.tenant, this);
  }

  /**
   * Provides access to project contexts.
   *
   * @return {ProjectContexts}
   */
  contexts() {
    return new ProjectContexts(this.tenant, this);
  }

  /**
   * Provides access to instances.
   *
   * @return {ProjectInstances}
   */
  instances() {
    return new ProjectInstances(this.tenant, this);
  }

  /**
   * Search the project using the specified criteria
   * @param {String} searchText text to search project for.
   * @param {Object} searchOptions search options
   * @param {Object} options             The options object.
   */
  search(searchText, searchOptions = {}, options = {}) {
    return this.tenant.execute(
      requests.searchProject(this.projectId, searchText, searchOptions),
      options
    );
  }
}
