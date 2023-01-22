import React from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
} from "carbon-components-react";
import { Link } from "react-router-dom";
import "../../styles/style-sheet/header-styles.scss";

const AppHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="">
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName element={Link} to="/" prefix="">
          Project Corpenicus
        </HeaderName>
        <HeaderNavigation aria-label="">
          <HeaderMenuItem element={Link} to="/">
            Home
          </HeaderMenuItem>
          <HeaderMenuItem element={Link} to="/projects">
            Projects
          </HeaderMenuItem>
        </HeaderNavigation>
      </Header>
    )}
  />
);

export default AppHeader;
