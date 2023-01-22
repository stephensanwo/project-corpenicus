import React from "react";
import "./App.scss";
import AppHeader from "./components/utils/AppHeader";
import HomePage from "./pages/HomePage";
import ProjectsHome from "./pages/studio/ProjectsHome";
import Project from "./pages/studio/Project";
import Login from "./pages/studio/Login";
import NewProject from "./pages/studio/NewProject";
import NewResource from "./pages/studio/NewResource";
import UploadImage from "./pages/studio/UploadImage";
import Resource from "./pages/studio/Resource";
import UDIBlockResult from "./pages/studio/UDIBlockResult";
import UDIGridResult from "./pages/studio/UDIGridResult";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/AuthRoute";

function App({ client }) {
  return (
    <AuthProvider client={client}>
      <Router>
        <AppHeader />
        <AuthRoute exact path="/" component={HomePage} />
        <AuthRoute exact path="/login" component={Login} />
        <Route exact path="/projects" component={ProjectsHome} />
        <Route exact path="/newproject" component={NewProject} />
        <Route exact path="/project/:project_id" component={Project} />
        <Route exact path="/newresource/:project_id" component={NewResource} />
        <Route
          exact
          path="/uploadimage/:project_id/:resource_id"
          component={UploadImage}
        />
        <Route
          exact
          path="/project/:project_id/:resource_id"
          component={Resource}
        />
        <Route
          exact
          path="/UDIblockresult/:project_id/:resource_id"
          component={UDIBlockResult}
        />
        <Route
          exact
          path="/UDIgridresult/:project_id/:resource_id"
          component={UDIGridResult}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
