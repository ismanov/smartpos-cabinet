export const validateINN = (inn) => {
    return !!inn && inn.length === 9 && !!inn.match(/[0-9]{9}/);
};
