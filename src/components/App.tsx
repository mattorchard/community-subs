import React from "react";
import ProjectList from "./ProjectList";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <section className="app__welcome-section">
        <h1 className="app__welcome-section__title">Community Subs</h1>
        <p className="app__welcome-section__explainer">
          Welcome to <strong>Community Subs</strong>! Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Nullam sed venenatis dui. Sed
          interdum ullamcorper leo at volutpat. Morbi non ipsum dolor. Maecenas
          nisi diam, blandit at tincidunt non, porttitor in nisi. Sed eu
          vehicula magna. Mauris sagittis urna vel nulla aliquet posuere. Nullam
          tellus erat, rutrum nec orci at, convallis varius dui. Aliquam libero
          turpis, fringilla accumsan mauris et, auctor feugiat eros. Nunc odio
          erat, pellentesque in fermentum et, ullamcorper nec nisi. Mauris non
          pretium eros. Maecenas diam elit, scelerisque sed elit vitae, sodales
          mollis enim. Morbi eget odio congue, auctor tellus eget, mollis nulla.
          Etiam sagittis accumsan augue, egestas sagittis eros dictum sed.
          Pellentesque finibus finibus lacus, quis volutpat nulla feugiat id.
        </p>
        {/*Todo: Warning to Safari users about storage issue */}
      </section>
      <section className="app__project-section">
        <ProjectList />
      </section>
    </div>
  );
};

export default App;
