import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import App from 'components/App'
import 'common.styl';
import records from 'store/records'; 
import {v4} from 'uuid';

const history = createHistory()

records.replace((window as any).recordsFromServer);

let token = localStorage.getItem('token');
if(!token) {
   token = v4() as string; 
   localStorage.setItem('token', token);
}

const initialUsername = (
    localStorage.getItem('username') || 
    'anonymous'
);

const render = (App: any) => ReactDOM.hydrate(
    <App
        history={history}
        token={token}
        initialUsername={initialUsername}
        onUsernameChange={(username: string) => {
            localStorage.setItem(
                'username',
                username
            );    
        }}
    />,
    document.getElementById('root')
)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line global-require
    const App = require('./components/App').default // eslint-ignore-line
    render(App)
  })
}

render(App)
