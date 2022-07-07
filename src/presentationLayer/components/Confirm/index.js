import React, { useState } from 'react';
import QuestionDialog from "../Dialog/question";

const Confirm = (props) => {
  const { title, message, onPositive } = props;
  
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return (
    <>
      <div onClick={open}>
        {props.children}
      </div>
      <QuestionDialog
        open={visible}
        title={title}
        message={message}
        onPositive={() => {
          onPositive();
          close();
        }}
        onNegative={close}
        onClose={close}
      />
    </>
  )
};

export default Confirm;