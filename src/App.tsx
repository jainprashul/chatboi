import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, people, personCircle, chatbox } from 'ionicons/icons';
import Dashboard from './pages/DashBoard';
import UserList from './pages/UserList';
import Profile from './pages/Profile';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { ROUTE } from './config/const';
import Login from './pages/Login';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path={ROUTE.signin} component={Login} exact={true} />
          <Route path={ROUTE.chat} component={Dashboard} exact={true} />
          <Route path={ROUTE.profile} component={Profile} exact={true}/>
          <Route path={ROUTE.users} component={UserList} exact={true}/>
          <Route path="/" render={() => <Redirect to={ROUTE.chat} />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href={ROUTE.users}>
            <IonIcon icon={people} />
            <IonLabel>Friends</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href={ROUTE.chat}>
            <IonIcon icon={chatbox} />
            <IonLabel>Chats</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href={ROUTE.profile}>
            <IonIcon icon={personCircle} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
