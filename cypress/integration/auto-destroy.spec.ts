import { getMeridianMap } from "./util/getMeridianMap";

describe("Auto-Destroy", () => {
  it("should automatically destroy itself after having the map container removed", () => {
    cy.visit("/cypress/basic");

    const onDestroyStub = cy.stub();
    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        onDestroy: onDestroyStub
      });
    });
    cy.window().then(win => {
      const mapContainer = win.document.querySelector("#meridian-map");
      if (!mapContainer) {
        throw new Error("no map container");
      }
      if (!mapContainer.parentElement) {
        throw new Error("no map container parent");
      }
      mapContainer.parentElement.removeChild(mapContainer);
    });
    cy.get("#meridian-map").should("not.exist");
    // Wait for the auto-destroy polling (1 second interval)
    cy.wait(1200);
    getMeridianMap().then(meridianMap => {
      expect(onDestroyStub).to.have.callCount(1);
      expect(meridianMap.isDestroyed).to.equal(true);
    });
  });

  it("should automatically destroy itself after having the map container contents removed", () => {
    cy.visit("/cypress/basic");

    const onDestroyStub = cy.stub();
    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        onDestroy: onDestroyStub
      });
    });
    // Wait for MeridianMap to be rendered...
    cy.wait(500);
    cy.window().then(win => {
      const mapContainer = win.document.querySelector("#meridian-map");
      if (!mapContainer) {
        throw new Error("no map container");
      }
      mapContainer.innerHTML = "<b>Destroyed</b>";
    });
    // Check that the map container's contents have been deleted
    cy.get(".meridian-map-container").should("not.exist");
    // Wait for the auto-destroy polling (1 second interval)
    cy.wait(1200);
    getMeridianMap().then(meridianMap => {
      expect(onDestroyStub).to.have.callCount(1);
      expect(meridianMap.isDestroyed).to.equal(true);
    });
  });
});
