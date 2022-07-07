import React from 'react';
import ReactDOM from 'react-dom';
import "../src/presentationLayer/components/material-components/assets/css/material-dashboard-react.css";
import './styles/index.scss';
import ReactNotification from 'react-notifications-component'
import "react-notifications-component/dist/theme.css";
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react'
import Root from './presentationLayer/containers/root';
import {MuiThemeProvider, createMuiTheme, } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';


const theme = createMuiTheme({
    palette: {
       primary: {
          main: '#009f3c'
       },
       secondary: {
         main: '#d63d3d',
       },
    },
    overrides: {
        MuiButton: {
            containedPrimary: {
                color: 'white',
            }
        }
    },
    typography: {
       useNextVariants: true
    }
 });

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <MuiThemeProvider theme={theme}>
                    <I18nextProvider i18n={i18n}>
                        <ReactNotification />
                        <Root />
                    </I18nextProvider>
                </MuiThemeProvider>
            </MuiPickersUtilsProvider>
        </PersistGate>        
    </Provider>,
document.getElementById('root'));

serviceWorker.register()


