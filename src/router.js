import {BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home";
import Layout from "./components/Layout";

const routes = [
    {
    path:"/",
    name: "Home",
    visible: false,
    Component: Home,

    },
];
//esse modo de escrever função se chama arrow functions 
const Router =() => (
<BrowserRouter>
<Layout routes={routes}>
    <Switch>
        {routes.map((route, index) =>(
            <Route
            component={route.component}
            exact
            key={index}
            path={route.path}
            />
        ))}
    </Switch>
</Layout>
</BrowserRouter>
); 

export default Router;