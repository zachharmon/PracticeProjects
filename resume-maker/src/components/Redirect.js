import { useEffect } from 'react';

function Redirect({ to }) {
  useEffect(() => {
    window.location = to;
    }, [to]);
    return null;
}

export default Redirect;
