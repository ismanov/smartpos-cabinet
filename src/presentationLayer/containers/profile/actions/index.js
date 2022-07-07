import Logic from '#businessLayer';


export const changePassword = (cp, np, props) => {
    return async dispatch => {
        try {
            await Logic.user.setPassword(cp, np);
            props.success('Успешно изменен!')
        } catch(error) {
            if (error.response && error.response.status === 400) {
                props.error && props.error('Указан неправильный пароль!');
            }
        }
    }
};