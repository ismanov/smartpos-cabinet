import ReactGA from 'react-ga';
import config from '../../../config';

class AnalyticsWrapper {

    constructor() {
        ReactGA.initialize(
            config.gaTrackingCode,
            {
                debug: true,
                titleCase: false
            });
    }

    setUserId(userId) {
        ReactGA.set({ userId });
    }

    setName(name) {
        ReactGA.set({ name });
    }

    registerEvent(category, action, label) {
        ReactGA.event({category, action, label});
    }

    pageView(url) {
        ReactGA.set({ page: url });
        ReactGA.pageview(url);
    }

    modalView(name) {
        ReactGA.modalview(name);
    }

}

const analytics = new AnalyticsWrapper();

export default analytics;
