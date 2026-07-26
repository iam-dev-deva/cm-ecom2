import {
  ON_AUTHSTATE_FAIL,
  ON_AUTHSTATE_SUCCESS,
  RESET_PASSWORD,
  SIGNIN,
  SIGNOUT,
  SIGNUP
} from '@/constants/constants';
import { SIGNIN as ROUTE_SIGNIN } from '@/constants/routes';
import { call, put } from 'redux-saga/effects';
import { signInSuccess, signOutSuccess } from '@/redux/actions/authActions';
import { clearBasket, setBasketItems } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { resetFilter } from '@/redux/actions/filterActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import { clearProfile, setProfile } from '@/redux/actions/profileActions';
import { history } from '@/routers/AppRouter';
import authService from '@/services/authService';

function* handleError(e) {
  yield put(setAuthenticating(false));
  yield put(setAuthStatus({
    success: false,
    type: 'auth',
    isError: true,
    message: e?.message || 'Something went wrong. Please try again.'
  }));
}

function* initRequest() {
  yield put(setAuthenticating());
  yield put(setAuthStatus({}));
}

function* authSaga({ type, payload }) {
  switch (type) {
    case SIGNIN:
      try {
        yield initRequest();

        const user = yield call(authService.signIn, payload.email, payload.password);

        yield put(setProfile(user));
        yield put(setBasketItems(user.basket || []));
        yield put(signInSuccess({
          id: user.id,
          role: user.role,
          provider: 'password'
        }));
        yield put(setAuthStatus({
          success: true,
          type: 'auth',
          isError: false,
          message: 'Successfully signed in. Redirecting...'
        }));
        yield put(setAuthenticating(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNUP:
      try {
        yield initRequest();

        const fullname = payload.fullname
          .split(' ')
          .map((name) => name[0].toUpperCase().concat(name.substring(1)))
          .join(' ');

        const user = yield call(authService.signUp, {
          fullname,
          email: payload.email,
          password: payload.password
        });

        yield put(setProfile(user));
        yield put(signInSuccess({
          id: user.id,
          role: user.role,
          provider: 'password'
        }));
        yield put(setAuthStatus({
          success: true,
          type: 'auth',
          isError: false,
          message: 'Successfully signed up. Redirecting...'
        }));
        yield put(setAuthenticating(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNOUT: {
      try {
        yield initRequest();
        yield call(authService.signOut);
        yield put(clearBasket());
        yield put(clearProfile());
        yield put(resetFilter());
        yield put(resetCheckout());
        yield put(signOutSuccess());
        yield put(setAuthenticating(false));
        yield call(history.push, ROUTE_SIGNIN);
      } catch (e) {
        console.log(e);
      }
      break;
    }
    case RESET_PASSWORD: {
      try {
        yield initRequest();
        yield call(authService.resetPassword, payload);
        yield put(setAuthStatus({
          success: true,
          type: 'reset',
          message: 'Password reset email has been sent to your provided email.'
        }));
        yield put(setAuthenticating(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    }
    // Fired on app load after we've checked for a stored token and
    // asked the API who it belongs to (see src/index.jsx).
    case ON_AUTHSTATE_SUCCESS: {
      const user = payload;

      yield put(setProfile(user));
      yield put(setBasketItems(user.basket || []));
      yield put(signInSuccess({
        id: user.id,
        role: user.role,
        provider: 'password'
      }));
      yield put(setAuthStatus({
        success: true,
        type: 'auth',
        isError: false,
        message: 'Successfully signed in. Redirecting...'
      }));
      yield put(setAuthenticating(false));
      break;
    }
    case ON_AUTHSTATE_FAIL: {
      yield put(clearProfile());
      yield put(signOutSuccess());
      break;
    }
    default: {
      throw new Error('Unexpected Action Type.');
    }
  }
}

export default authSaga;
