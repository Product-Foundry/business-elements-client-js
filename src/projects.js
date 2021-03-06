"use strict";

import endpoint from "./endpoint";
import Project from "./project";
import * as requests from "./requests";

/**
 * Abstract representation of projects.
 */
export default class Projects {

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
   * Retrieves the list of projects in the current tenant.
   *
   * @param  {Object} options         The options object.
   * @return {Promise<Array<Object>, Error>}
   */
  list(options = {}) {
    return this.tenant.execute({path: endpoint("projects")}, options)
      // return empty string when response is missing certain fields to help client logic
      .then((response) => {
        if (response["_embedded"]) {
          return response["_embedded"]["be:project"];
        } else {
          return [];
        }
      });
  }

  /**
   * Retrieve a project object to perform operations on it.
   *
   * @param  {String} id The id of the project.
   * @return {Project}
   */
  project(id) {
    return new Project(this.tenant, id);
  }

  /**
   * Creates the project with the specified properties.
   *
   * @param  {String}  name         The name of the project.
   * @param {String} description    The description of the project
   * @param  {Object} options       The options object.
   * @return {Promise<Object, Error>}
   */
  create(name, description, options = {}) {
    return this.tenant.execute(
      requests.createProject(name, description),
      options
    );
  }
}
