import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useUserData = () => {
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.success && isValidObject(user?.result)) {
      let data = user?.result;
      setUserData(data);
    }
  }, [user]);

  return userData;
};

const isValidObject = (obj) => {
  return obj && Object.keys(obj).length > 0;
};

export default useUserData;