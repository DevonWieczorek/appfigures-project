# AppFigures Coding Challenge

If you’d like to watch the journey that this application took along the way, feel free to check the commit history in the [Github Repo](https://github.com/DevonWieczorek/appfigures-project). 

## Bootstrapping

I opted to use Vite to spin up the project. It comes with ESLint, TS, and fast refresh out of the box without need for additional setup like alternatives such as Webpack would require.

NextJS was another contender but it felt like overkill for this project since there’s only one route. It would have helped with obscuring API endpoint however.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Styling

For convenience that still offers strong customization, I opted to use TailwindCSS.

Potential pitfall of this decision is that there could be a learning curve for other devs who haven’t worked with Tailwind. For a project this small, custom styles via css modules would have been sufficient, however Tailwind is a bit of a time saver and would prove more useful as the app grows.

## Environment Variables

I wanted to push my work to Github just in case of disaster. It was requested that I not make the API endpoint public, so I opted to use an env variable. If we were to actually run this code on a server, it would still expose that endpoint when making network requests, in which case we would want to use a server-to-server call. Since this app doesn’t need to be hosted anywhere, an environment variable will suffice.

## Data Flow

For this app, URL params are treated as the source of truth. When a user changes an input’s value, the value is pushed into the query param. When the search params are updated, the app validates the value and then makes a subsequent api call with the new filter criteria. 

This enables deep linking (going straight to page 2 via the url should load 50 reviews, not 25), and preserves navigation history.

## Future Improvements

- [ ] Add more AppFigures-specific branding to styles.
- [ ] Add testing to ensure our code does what it’s supposed to.
- [ ] Make the reviewed product dynamic, either via a route or a fuzzy search input.
- [ ] Who doesn't love a light/dark mode toggle??
- [ ] Improved filtering - count per page, language, date range, multiple star selection, click on username to filter by user.
- [ ] Fine-tuning the debounce time for the api call/setting of keyword in the url.
