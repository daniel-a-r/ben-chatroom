export interface Message {
  id: string;
  content: string;
  user: string;
  displayName?: boolean;
  displayOnlineStatus?: boolean;
}

export interface PageProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}
