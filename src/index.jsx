import { Preloader } from '@/components/common';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from '@/redux/actions/authActions';
import configureStore from '@/redux/store/store';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import authService from '@/services/authService';
import { tokenStorage } from '@/services/api';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');

// Render the preloader on initial load
render(<Preloader />, root);

// Restore the session from a stored JWT (if any), replacing Firebase's
// onAuthStateChanged. If there's no token, or it's no longer valid,
// we simply treat the user as signed out.
(async () => {
  const token = tokenStorage.get();

  if (token) {
    try {
      const user = await authService.getCurrentUser();

      store.dispatch(onAuthStateSuccess(user));
    } catch (e) {
      store.dispatch(onAuthStateFail('Failed to authenticate'));
    }
  } else {
    store.dispatch(onAuthStateFail('Not signed in'));
  }

  // then render the app after checking the auth state
  render(<App store={store} persistor={persistor} />, root);
})();

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
