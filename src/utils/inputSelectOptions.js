export const selectStyles = (error = null) => {
 return {
   control: (styles, state) => ({
     ...styles,
     width: '100%',
     height: 56,
     borderColor: !state.menuIsOpen ? error ? "#FF0000" : "#ccc" : "#009F3C",
     boxShadow: !state.menuIsOpen ? "none" : "0 0 0 1px #009f3c"
   })
 }
};

export const selectTheme = (theme) => {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#009F3C',
    },
  }
};