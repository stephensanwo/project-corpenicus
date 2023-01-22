import React, { useContext, Fragment } from "react";
import { Logout32, User32, Query32 } from "@carbon/icons-react";
import { Button } from "carbon-components-react";
import { AuthContext } from "../../context/auth";

const SettingsNav = () => {
  const { logout } = useContext(AuthContext);
  return (
    <Fragment>
      <Button
        renderIcon={Logout32}
        iconDescription="Logout"
        kind="ghost"
        onClick={logout}
      >
        Logout
      </Button>
      <Button renderIcon={User32} iconDescription="User Profile" kind="ghost">
        User
      </Button>
      <Button renderIcon={Query32} iconDescription="Get Help" kind="ghost">
        Help
      </Button>
    </Fragment>
  );
};

export default SettingsNav;
