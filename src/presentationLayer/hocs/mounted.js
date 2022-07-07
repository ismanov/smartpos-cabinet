import React from 'react';

const mounted = (Component) => {
    return class WithNotificationComponent extends React.Component {

        state = {
            mount: false
        };

        componentDidMount() {
            this.setState({ mount: true })
        }

        componentWillUnmount() {
            this.setState({ mount: false })
        }

        render() {
            return (
                <div className="h-100 w-100">
                    <Component {...this.props} mount={this.state.mount} />
                </div>

            )
        }
    }
};

export default mounted;
