export interface AuthUser {
  _id?: string;
  fullName?: string;
  email?: string;
  profilePic?: string;
  createdAt?: string;
}

export interface SignupBody {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatedProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: any | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignupBody) => Promise<void>;
  login: (data: LoginBody) => Promise<void>;
  logout: () => Promise<void>;
  updateProfil: (data: {profilePic: string}) => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
}