"use strict";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import BusinessElementsClient from "../src";
import * as requests from "../src/requests";
import uuid from "uuid";

chai.use(chaiAsPromised);
chai.should();
chai.config.includeStack = true;

const FAKE_SERVER_URL = "http://api.fake-server";

/** @test {Concept} */
describe("Concept", () => {
  let sandbox, client, conceptId, concept;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    client = new BusinessElementsClient(FAKE_SERVER_URL);
    conceptId = uuid.v4();
    concept = client.tenant("example.com").concepts().concept(conceptId);
  });

  afterEach(() => {
    sandbox.restore();
  });

  /** @test {Concept#get} */
  describe("#get()", () => {
    const data = {id: conceptId};

    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(data));
    });

    it("should get concept", () => {
      concept.get();

      sinon.assert.calledWithMatch(client.execute, {
        path: `/concepts/${conceptId}`
      });
    });

    it("should return concept data", () => {
      return concept.get().should.become(data);
    });
  });

  /** @test {Concept#edit} */
  describe("#edit()", () => {
    const response = {status: "Ok"};
    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(response));
      sandbox.spy(requests, "updateConcept");
    });

    it("should edit the concept", () => {
      concept.edit({"title": "My concept"}, {});

      sinon.assert.calledWithMatch(requests.updateConcept, conceptId, {"title": "My concept"});
    });

    it("should return success", () => {
      return concept.edit({"title": "My concept"}, {}).should.eventually.become(response);
    });
  });

  /** @test {Concept#editCategory} */
  describe("#updateConceptCategory()", () => {
    const response = {status: "Ok"};
    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(response));
      sandbox.spy(requests, "updateConceptCategory");
    });

    it("should edit the concept category", () => {
      concept.updateConceptCategory({"conceptCategory": "Reason"}, {});

      sinon.assert.calledWithMatch(requests.updateConceptCategory, conceptId, {"conceptCategory": "Reason"});
    });

    it("should return success", () => {
      return concept.updateConceptCategory({"conceptCategory": "Reason"}, {}).should.eventually.become(response);
    });
  });

  /** @test {Concept#editform} */
  describe("#editForm()", () => {
    const response = {status: "Ok"};
    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(response));
      sandbox.spy(requests, "updateConceptForm");
    });

    it("should edit the concept form", () => {
      concept.editForm([{"key": "name"}, {"type": "text"}], {});

      sinon.assert.calledWithMatch(requests.updateConceptForm, conceptId, [{"key": "name"}, {"type": "text"}]);
    });

    it("should return success", () => {
      return concept.updateConceptCategory([{"key": "name"}, {"type": "text"}], {}).should.eventually.become(response);
    });
  });

  /** @test {Concept#createRelationSpecification} */
  describe("#createRelationSpecification()", () => {
    const response = {status: "Ok"};
    beforeEach(() => {
      sandbox.stub(client, "execute").returns(Promise.resolve(response));
      sandbox.spy(requests, "createRelationSpecification");
    });

    it("should create a concept relation", () => {
      concept.createRelationSpecification("person-equipment", "Association", {});

      sinon.assert.calledWithMatch(requests.createRelationSpecification, conceptId, "person-equipment", "Association");
    });

    it("should return success", () => {
      return concept.createRelationSpecification("person-equipment", "Association", {}).should.eventually.become(response);
    });
  });

});
