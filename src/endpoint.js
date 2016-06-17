"use strict";

/**
 * Endpoints templates.
 * @type {Object}
 */
const ENDPOINTS = {
  root:                                       () => "/",

  // Authentication

  authentications:                    () => "/authentications",
  authentication:                   (id) => `/authentications/${id}`,
  currentAuthentication:              () => "/authentications/current",

  // Tenant

  currentTenant:                      () => "/tenants/current",

  // Users

  users:                               () => "/users",
  user:                              (id) => `/users/${id}`,
  userPasswordResetRequest:            () => "/users/password_reset_request",
  userPasswordReset:                   () => "/users/password_reset",
  userEmailAddressRequest:             () => "/users/email_address_request",
  userActivation:                      () => "/users/activation",
  me:                                  () => "/users/me",
  checkRegistrationStatus:             () => "/users/registration_check",

  // Projects

  projects:                            () => "/projects",
  project:                           (id) => `/projects/${id}`,
  projectContexts: (projectId, contextId) => `/projects/${projectId}/contexts`,
  projectContext:  (projectId, contextId) => `/projects/${projectId}/contexts/${contextId}`,

  // Organizations

  organizations:                       () => "/organizations",
  organization:                      (id) => `/organizations/${id}`
};

/**
 * Retrieves a server endpoint by its name.
 *
 * @private
 * @param  {String}    name The endpoint name.
 * @param  {...string} args The endpoint parameters.
 * @return {String}
 */
export default function endpoint(name, ...args) {
  return ENDPOINTS[name](...args);
}
