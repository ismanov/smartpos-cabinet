const getAuthData = () => {
    const string = localStorage.getItem('auth')
    return string ? JSON.parse(string) : undefined
};

export const saveAuthData = (data) => {
    const json = JSON.stringify(data);
    localStorage.setItem('auth', json)
};

export const saveCurrentUser = (user) => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
    }
}

export const getCurrentUser = () => {
    let userString = localStorage.getItem('currentUser');
    if (!userString) return undefined
    else {
        return JSON.parse(userString)
    }
}

var data = getAuthData();

let memory = {
    accessToken: data ? data.access_token : undefined,
    refreshToken: data  ? data.refresh_token : undefined
};

export const clearData = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('currentUser');
    memory.accessToken = undefined;
    memory.refreshToken = undefined;
};

export const refreshAuthData = (data) => {
    saveAuthData(data);
    memory = {
        accessToken: data ? data.access_token : undefined,
        refreshToken: data  ? data.refresh_token : undefined
    };
    data = getAuthData()
};

export default memory;
