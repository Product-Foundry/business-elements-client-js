"use strict";

import ApplicationForm from "./application-form";
import endpoint from "./endpoint";


/**
 * Abstract representation of Application Forms.
 */
export default class ApplicationForms {

  /**
   * Constructor.
   *
   * @param   {Tenant}      tenant          The tenant instance.
   * @param   {Application} application     The application instance
   */
  constructor(tenant, application) {

    /**
     * The tenant.
     * @type {Tenant}
     */
    this.tenant = tenant;

    /**
     * The application
     * @type {Application}
     */
    this.application = application;
  }

  /**
   * Retrieves the list of forms for the current application
   *
   * @param {Object} options          The options object
   * @return {Promise<Array<Object>, Error>}
   */
  list(options = {}) {
    return this.tenant.execute({path: endpoint("applicationForms", (this.application.applicationHandle))}, options)
      .then(response => {
        if (response["_embedded"]) {
          return response["_embedded"]["be:application_form"];
        } else {
          return [];
        }
      });
  }

  /**
   * Retrieves an application form object
   *
   * @param {String}              formHandle The handle of the application form
   * @returns {ApplicationForm}
   */
  form(formHandle) {
    return new ApplicationForm(this.tenant, this.application, formHandle);
  }
}
