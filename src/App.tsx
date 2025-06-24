import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import BasicComicBookManager from "./components/BasicComicBookManager";
import AppNavigationMenu from "./components/NavigationMenu";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <AppNavigationMenu />
                <BasicComicBookManager />
              </div>
            }
          />
          <Route
            path="/advanced"
            element={
              <div>
                <AppNavigationMenu />
                <Home />
              </div>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
