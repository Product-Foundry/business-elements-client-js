"use strict";

import endpoint from "./endpoint";
import * as requests from "./requests";

/**
 * Abstract representation of a instance.
 */
export default class Instance {

  /**
   * Constructor.
   *
   * @param  {Tenant} tenant     The tenant instance.
   * @param  {String} instanceId  The instance id.
   */
  constructor(tenant, projectId, instanceId) {

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

    /**
     * The instance id.
     * @type {String}
     */
    this.instanceId = instanceId;
  }

  /**
   * Retrieves instance.
   *
   * @param  {Object} options         The options object.
   * @return {Promise<Object, Error>}
   */
  get(options = {}) {
    return this.tenant.execute(
      {
        path: endpoint("instance", this.projectId, this.instanceId)
      },
      options
    );
  }


  /**
   * Delete instance
   *
   * @param  {Object} options         The options object.
   * @returns {Promise.<Object, Error>}
   */
  remove(options = {}) {
    return this.tenant.execute(
      requests.deleteInstance(this.projectId, this.instanceId),
      options
    );
  }

  /**
   * Update the instance
   *
   * @param  {Object} updateOperations  the update-operations to perform on the instance
   * @param  {Object} options           The options object.
   * @returns {Promise.<Object, Error>}
   */
  update(updateOperations, options = {}) {
    return this.tenant.execute(
      requests.updateInstance(this.projectId, this.instanceId, updateOperations),
      options
    );
  }
}