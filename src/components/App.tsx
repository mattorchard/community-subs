import React, { ReactElement } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useProject } from "../hooks/ProjectRepositoryHooks";
import ProjectList from "./ProjectList";
import ProjectOverview from "./ProjectOverview";
import Spinner from "./Spinner";
import Studio from "./Studio";
import "./App.css";
import { Project } from "../repositories/ProjectRepository";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <Route
        path="/project/:projectId"
        render={({ match }) => (
          <ProjectLoadingWrapper
            projectId={match.params.projectId}
            render={(project) => <ProjectOverview project={project} />}
          />
        )}
      />
      <Route
        path="/studio/:projectId/:transcriptId"
        render={({ match }) => (
          <ProjectLoadingWrapper
            projectId={match.params.projectId}
            render={(project) => (
              <Studio
                project={project}
                transcriptId={match.params.transcriptId}
              />
            )}
          />
        )}
      />

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>
);

const ProjectLoadingWrapper: React.FC<{
  projectId: string;
  render: (project: Project) => ReactElement<any, any> | null;
}> = ({ projectId, render }) => {
  const { project, error, loading } = useProject(projectId);
  if (loading) {
    return <Spinner fadeIn />;
  }
  if (error || !project) {
    // Todo: proper error message
    return <Redirect to="/" />;
  }
  return render(project);
};

const LandingPage = () => (
  <div className="landing-page" id="welcome">
    <section className="landing-page__welcome-section">
      <h1 className="landing-page__welcome-section__title">Community Subs</h1>
      <p className="landing-page__welcome-section__explainer">
        Welcome to <strong>Community Subs</strong>! Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Nullam sed venenatis dui. Sed interdum
        ullamcorper leo at volutpat. Morbi non ipsum dolor. Maecenas nisi diam,
        blandit at tincidunt non, porttitor in nisi. Sed eu vehicula magna.
        Mauris sagittis urna vel nulla aliquet posuere. Nullam tellus erat,
        rutrum nec orci at, convallis varius dui. Aliquam libero turpis,
        fringilla accumsan mauris et, auctor feugiat eros. Nunc odio erat,
        pellentesque in fermentum et, ullamcorper nec nisi. Mauris non pretium
        eros. Maecenas diam elit, scelerisque sed elit vitae, sodales mollis
        enim. Morbi eget odio congue, auctor tellus eget, mollis nulla. Etiam
        sagittis accumsan augue, egestas sagittis eros dictum sed. Pellentesque
        finibus finibus lacus, quis volutpat nulla feugiat id.
      </p>
      {/*Todo: Warning to Safari users about storage issue */}
    </section>
    <section className="landing-page__project-section">
      <ProjectList />
    </section>
  </div>
);

export default App;
