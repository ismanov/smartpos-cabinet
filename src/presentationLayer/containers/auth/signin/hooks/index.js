import { useSelector, useDispatch, } from 'react-redux';
import { signInAction, clearErrorTextAction } from './redux/actions';
import { useHistory } from 'react-router-dom';

export const useSignIn = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const errorText = useSelector(state => state.get('signIn').errorText);
    const isLoading = useSelector(state => state.get('signIn').isLoading);
    
    return {
        state: {
            errorText, 
            isLoading,
        },
        actions: {
            signIn: (username, password) => dispatch(signInAction(username, password, history)),
            clearErrorText: () => dispatch(clearErrorTextAction())
        },
        history,
    };
};