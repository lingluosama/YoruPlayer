import React from 'react';

const Backdrop = ({ show, onClick, children }) => {
  return show ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={onClick}
    >
        {children}
    </div>
  ) : null;
};

export default Backdrop;
