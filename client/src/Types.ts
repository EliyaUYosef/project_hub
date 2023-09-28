
export interface User {
  id?: string | "";
  name?: string | "";
  score?: number | 0;
  durationInDays?: number | 0;
  bugsCount?: number | 0;
  madeDadeline?: boolean | false;
}

export interface PersonalDetails {
  Team: string | "";
  avatar: string | "";
  name: string | "";
  joinedAt: string | "";
}

export interface GlobalData {
  userData?: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
  apiToken?: string | '';
  setApiToken: React.Dispatch<React.SetStateAction<string>>;
  personalDetails?: PersonalDetails;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;

  setAppGlobalData: React.Dispatch<React.SetStateAction<GlobalData>>;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  emailError?: string | "";
  passwordError?: string | "";
}
// =========================================================
