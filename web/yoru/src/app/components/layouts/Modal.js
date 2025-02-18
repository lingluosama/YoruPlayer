import React from 'react';

const Backdrop = ({ show, onClick, children }) => {
  return  (
    <div
      className={`fixed inset-0 bg-black  
      ${show?`bg-opacity-50 z-40`:`bg-opacity-0 -z-10`} 
      transition-all duration-300 flex items-center justify-center`}
      onClick={onClick}
    >
      <div className={`w-full h-full flex items-center transition-all duration-300 justify-center 
      ${show?`opacity-100 z-40`:`opacity-0 -z-10 translate-x-24`}`}>
        {children}
    </div>
    </div>
  );
};

export default Backdrop;
