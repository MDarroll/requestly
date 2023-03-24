import { useEffect } from "react";
import firebaseApp from "firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initIntegrations } from "modules/analytics";
import { initGrowthbook } from "utils/feature-flag/growthbook";

const useThirdPartyIntegrations = () => {
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      initIntegrations(user);
      initGrowthbook(user);
    });
  }, []);
};

export default useThirdPartyIntegrations;
