export type SignInCredential = {
  password: string;
  username: string;
};

export type SignInResponse = {
  accessToken: string;
  user: {
    userName: string;
    authority: string[];
    avatar: string;
    username: string;
  };
};

export type SignUpResponse = SignInResponse;

export type SignUpCredential = {
  username: string;
  password: string;
};

export type ForgotPassword = {
  username: string;
};

export type ResetPassword = {
  password: string;
};

export type GoogleSignUpCredential = {
  email: string;
  display_name: string;
  google_id: string;
  photo_url: string;
};

export type GoogleSignInResponse = {
  status: "success" | "failed";
  message: string;
  data: {
    token?: {
      access_token: string;
      refresh_token: string;
      token_type: string;
    };
    user?: {
      email: string;
      display_name: string;
      password: string | null;
      default_workspace_id: string | null;
      google_id: string;
      photo_url: string;
      id: string;
      type: string;
      user_id: string;
      agents?: string[];
    };
    workspace?: {
      id: string;
      name: string;
      owner_id: string;
      settings: {
        input_guardrails: boolean;
        output_guardrails: boolean;
      };
      is_private: boolean;
      created_at: string;
      type: string;
      role: string;
    };
    workspaces?: Array<{
      id: string;
      name: string;
      owner_id: string;
      settings: {
        input_guardrails: boolean;
        output_guardrails: boolean;
      };
      is_private: boolean;
      created_at: string;
      type: string;
      role: string;
    }>;
    can_register?: boolean;
    registration_required?: boolean;
    email?: string;
  };
};

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  settings: {
    input_guardrails: boolean;
    output_guardrails: boolean;
  };
  is_private: boolean;
  created_at: string;
  type: string;
  role: string;
}

export type WorkspacesResponse = {
  data: Workspace[];
};

export type UserRegisterCredential = {
  name: string;
  email: string;
  workspace_id: string;
};

export type UserRegisterResponse = {
  status: "success" | "failed";
  message: string;
  data?: {
    token: {
      access_token: string;
      refresh_token: string;
      token_type: string;
    };
    user: {
      email: string;
      display_name: string;
      password: string | null;
      default_workspace_id: string | null;
      google_id: string;
      photo_url: string;
      id: string;
      type: string;
      user_id: string;
      agents?: string[];
    };
    workspace: {
      id: string;
      name: string;
      owner_id: string;
      settings: {
        input_guardrails: boolean;
        output_guardrails: boolean;
      };
      is_private: boolean;
      created_at: string;
      type: string;
      role: string;
    };
    workspaces?: Array<{
      id: string;
      name: string;
      owner_id: string;
      settings: {
        input_guardrails: boolean;
        output_guardrails: boolean;
      };
      is_private: boolean;
      created_at: string;
      type: string;
      role: string;
    }>;
  };
};