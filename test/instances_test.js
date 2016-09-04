"use strict";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {fakeServerResponse} from "./test_utils.js";
import sinon from "sinon";
import uuid from "uuid";
import BusinessElementsClient from "../src";

import * as requests from "../src/requests";

chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true;

const FAKE_SERVER_URL = "http://api.fake-server";

/** @test {Instances} */
describe("Instances", () => {
  let sandbox, client, instances, projectId, conceptId;

  beforeEach(() => {
    projectId = uuid.v4();
    conceptId = uuid.v4();
    sandbox = sinon.sandbox.create();
    client = new BusinessElementsClient(FAKE_SERVER_URL);
    instances = client.tenant("example.com").projects().project(projectId).instances();
  });

  afterEach(() => {
    sandbox.restore();
  });

  /** @test {Instances#searchByConceptId} */
  describe("#searchByConceptId()", () => {
    beforeEach(() => {
      sandbox.stub(root, "fetch").returns(fakeServerResponse(201, {}, {}));
      sandbox.spy(requests, "searchInstances");
    });

    const data = [{id: "a"}, {id: "b"}];
    const actual = {
      "_embedded" : {
        "be:instance" : data
      }
    };

    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(actual));
    });

    it("should call instances url", () => {
      instances.searchByConceptId(conceptId);

      sinon.assert.calledWithMatch(client.execute, {
        path: "/search/instances"
      });
    });

    it("should return the list of instances", () => {
      return instances.searchByConceptId(conceptId).should.become(data);
    });
  });

  /** @test {Instances#create} */
  describe("#create", () => {
    beforeEach(() => {
      sandbox.stub(root, "fetch").returns(fakeServerResponse(201, {}, {}));
      sandbox.spy(requests, "createInstance");
    });

    const conceptHandle = "conceptHandle";
    const properties = [{"title": "My instance"}, {"age": "19"}];

    it("should execute request", () => {
      instances.create(conceptHandle, properties);
      sinon.assert.calledWithMatch(requests.createInstance, projectId, conceptHandle, properties);
    });

  });

});