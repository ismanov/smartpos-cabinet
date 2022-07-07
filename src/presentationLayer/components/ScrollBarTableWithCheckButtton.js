import React, { useState, useEffect, useCallback } from "react";
import { Checkbox, makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useStyle = makeStyles(() => ({
  branchesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
    paddingLeft: 20,
    borderBottom: "#009f3c 1px solid",
  },
  ScrollBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: 250,
    width: "100%",
    marginBottom: 5,
    overflowY: "auto",
  },
  branchesRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 40,
    marginTop: 5,
    paddingBottom: 15,
  },
  branchesHeader: {
    fontWeight: 700,
    fontSize: "1.1em",
    height: 60,
    padding: 0,
    margin: 0,
    borderBottom: "#009f3c 1px solid",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  smallText: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 4,
  },

  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  branchesColumn1: {
    flex: "15%",
  },
  branchesColumn2: {
    flex: "10%",
  },
  branchesColumn3: {
    flex: "75%",
    paddingLeft: 5,
  },
}));

const ScrollBar = ({ data, onChange }) => {
  const classes = useStyle(); // styles

  // states %start
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBranchesHistory, setSelectedHistory] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [render, setRender] = useState(false);
  const [rerender, setReRender] = useState(false);
  // end%

  // effects %start
  useEffect(
    () => {
      setRender(true);
      if (selectAll) {
        setSelectedHistory(selectedBranches);
        setSelectedBranches(data.map((item) => item.id));
      } else {
        setSelectedBranches(selectedBranchesHistory);
      }
    },
    [selectAll]
  );
  useEffect(
    () => {
      if (render) {
        setReRender((prev) => !prev);
        setRender(false);
      }

      onChange && onChange(selectedBranches);
    },
    [selectedBranches]
  );
  //  end%

  const RenderItem = useCallback(
    ({ item, i }) => {
      const isInclude = selectedBranches.includes(item.id);
      const onChangeHandler = (value) => {
        setSelectedBranches((prev) => {
          if (value) {
            if (!isInclude) {
              return [...prev, item.id];
            }
          } else {
            return prev.filter((id) => id !== item.id);
          }
          return prev.slice();
        });
      };
      return (
        <BrachRow
          name={item.name}
          index={i}
          key={item.id}
          onChangeValue={onChangeHandler}
          classes={classes}
          value={!!isInclude}
        />
      );
    },
    [rerender]
  );

  return (
    <div onClose={classes.branchesContainer}>
      <div
        style={{ color: "#009f3c" }}
        className={clsx(classes.branchesRow, classes.branchesHeader)}
      >
        <div
          className={clsx(
            classes.branchesColumn1,
            classes.flexCenter,
            classes.flexColumn
          )}
        >
          <span className={classes.smallText}>Выделить все</span>
          <Checkbox
            color="primary"
            id="all"
            checked={selectAll}
            onChange={(event) => {
              setSelectAll(event.target.checked);
            }}
          />
        </div>
        <div className={clsx(classes.branchesColumn2, classes.flexCenter)} />
        <div className={clsx(classes.branchesColumn3)}>Филиалы</div>
      </div>
      <div className={classes.ScrollBar}>
        {data && data.map((item, i) => <RenderItem item={item} i={i} />)}
      </div>
    </div>
  );
};
export default ScrollBar;

const BrachRow = React.memo(
  ({ classes, name, index, onChangeValue, value, key }) => {
    // states %start
    const [check, setCheck] = useState(value);
    const [isFirst, setIsFirst] = useState(true);
    //end%

    //effects %start
    useEffect(
      () => {
        if (isFirst) setIsFirst(false);
        else onChangeValue(check);
      },
      [check]
    );
    // end%
    return (
      <div className={classes.branchesRow}>
        <div className={clsx(classes.branchesColumn1, classes.flexCenter)}>
          <Checkbox
            color="primary"
            id={key}
            checked={check}
            onChange={(e) => setCheck(e.target.checked)}
          />
        </div>
        <div className={clsx(classes.branchesColumn2, classes.flexCenter)}>
          {index + 1}
        </div>
        <div className={clsx(classes.branchesColumn3)}>{name}</div>
      </div>
    );
  }
);
