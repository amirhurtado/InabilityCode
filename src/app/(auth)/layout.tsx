import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='container'>
      {children}
    </div>
  );
};

export default layout;
