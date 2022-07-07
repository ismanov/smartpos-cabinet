const roles = Object.freeze({
        ROLE_OWNER: "Владелец",
        ROLE_USER: 'Пользователь',
        ROLE_BRANCH_ADMIN: "Администратор",
        ROLE_ADMIN: "Администратор",
        ROLE_CASHIER:  "Кассир",
        ROLE_WAREHOUSE_MANAGER: "Зав. склад",
        ROLE_INTERN: "Стажер",
        ROLE_AUDITOR: "Аудитор",
        ROLE_OPERATOR: "Оператор",
});

export const getRoleName = (role) => roles[role] || 'Неизвестно';