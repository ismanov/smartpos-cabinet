import debounce from "@material-ui/core/utils/debounce";

export const updateFilterSearch = debounce((action) => {
  action();
}, 400);