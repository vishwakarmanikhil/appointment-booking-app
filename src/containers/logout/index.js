import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {
  const { userLogout } = useContext(AuthContext);

    useEffect(() => {
      userLogout();
    }, [userLogout]);

    return (
        <div></div>
    )
}

export default Logout;