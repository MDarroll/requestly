import { GrowthBook } from "@growthbook/growthbook";
import { buildBasicUserProperties } from "modules/analytics/utils";


export const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-ONIe1oQehroUJmyv",
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    // TODO: Use your real analytics tracking system
    console.log("Viewed Experiment", {
      experimentId: experiment.key,
      variationId: result.key
    }, experiment, result);
  }
});

export const initGrowthbook = (user) => {
    let id = null;
    let email = null;

    if(user) {
        const userData = buildBasicUserProperties(user);
    
        id = userData?.uid;
        email = userData?.email;
    }
  
    initGrowthbookAttributes(id, email);
};


export const initGrowthbookAttributes = (id, email) => {
    const attributes = {
        "id": id,
        "email": email
    }
  
    console.log("Setting GB attributes", attributes);
    growthbook.setAttributes(attributes);
};