
import { useRef, useImperativeHandle, forwardRef } from 'react';
import AuthContext from './AuthContext';
import appConfig from '@/configs/app.config';
import { useSessionUser, useToken } from '@/store/authStore';
import { apiSignIn, apiSignOut } from '@/services/AuthService';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import type {
    SignInCredential,
    AuthResult,
    User,
    Token,
} from '@/@types/auth';
import type { ReactNode } from 'react';
import type { NavigateFunction } from 'react-router-dom';

type AuthProviderProps = { children: ReactNode };

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction;
};

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
    const navigate = useNavigate();

    useImperativeHandle(
        ref,
        () => {
            return {
                navigate,
            };
        },
        [navigate]
    );

    return <></>;
});

const initialUser: User = {
    empCode: '',
    name: '',
    email: '',
    roles: [],
};
function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn);
    const user = useSessionUser((state) => state.user);
    const setUser = useSessionUser((state) => state.setUser);
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn);
    const { token, setToken } = useToken();

    const authenticated = Boolean(token && signedIn);

    const navigatorRef = useRef<IsolatedNavigatorRef>(null);

    const redirect = () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const redirectUrl = params.get(REDIRECT_URL_KEY);

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
        );
    };

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken);
        setSessionSignedIn(true);

        if (user) {
            setUser(user);
        }
    };

    const handleSignOut = () => {
        setToken('');
        setUser(initialUser);
        setSessionSignedIn(false);
    };

    const signIn = async (values: SignInCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignIn(values);
            if (resp) {
                handleSignIn({ accessToken: resp.token }, resp.user);
                redirect();
                return {
                    status: 'success',
                    message: 'Sign-in successful',
                };
            }
            return {
                status: 'failed',
                message: 'Unable to sign in',
            };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };


    const signOut = async () => {
        try {
            await apiSignOut();
        } finally {
            handleSignOut();
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signOut,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    );
}

IsolatedNavigator.displayName = 'IsolatedNavigator';

export default AuthProvider;