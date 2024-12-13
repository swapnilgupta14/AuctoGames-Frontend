import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-5C0PS4QKX3", {
    debug: true, 
    gaOptions: {
      siteSpeedSampleRate: 100, 
    },
  });
};

export const trackPageView = (path, userProperties = {}) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    ...userProperties,
  });
};

export const trackEvent = (category, action, label, value = 0) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

export const trackBounce = (path) => {
  ReactGA.event({
    category: "User Engagement",
    action: "Bounce Detected",
    label: path,
    nonInteraction: true, 
  });
};

export const setCustomDimensions = (dimensions) => {
  ReactGA.set(dimensions);
};

export const trackUserTiming = (category, variable, value, label) => {
  ReactGA.timing({
    category, 
    variable, 
    value, 
    label,
  });
};

export const identifyUser = (userId, userProperties = {}) => {
  ReactGA.set({
    userId,
    ...userProperties,
  });
};