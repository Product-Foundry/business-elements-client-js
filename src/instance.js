"use strict";

import endpoint from "./endpoint";
import InstanceCells from "./instance-cells";

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
  constructor(tenant, instanceId) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;

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
  getInstance(options = {}) {
    return this.tenant.execute(
      {
        path: endpoint("instance", this.instanceId)
      },
      options
    );
  }

  /**
   * Retrieve a instance object to perform operations on it.
   *
   * @param  {String} instanceId        The id of the instance.
   * @return {InstanceCells}
   */
  cells() {
    return new InstanceCells(this.tenant, this.instanceId);
  }
}
