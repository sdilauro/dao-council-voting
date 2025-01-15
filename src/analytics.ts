import ReactGA from "react-ga4";

export const initializeGA = () => {
  ReactGA.initialize("G-EWFD021Y28")
};

export const trackPageView = (url: string) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

export const trackEvent = (action: string, category: string, label: string) => {
  ReactGA.event({
    action,
    category,
    label,
  });
};
