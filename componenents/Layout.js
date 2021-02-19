import { useEffect } from "react";
import useSWR from "swr";
import Auth from "../hooks/useAuthentication";
import fetcher from "../utils/fetcher";
function Layout({ children }) {
  const UserData = Auth.useContainer();

  const { data: authorizedUser } = useSWR(
    `
    { 
      authorized{
        _id
        username
      }
    }
  `,
    fetcher
  );

  useEffect(() => {
    authorizedUser
      ? UserData.setUser(authorizedUser.authorized)
      : UserData.setUser(null);
  }, [authorizedUser]);
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-red-500 flex">
        <p className="p-2 font-bold text-lg text-center">
          Story Tool <em>Next</em>
        </p>
      </header>
      <main className="container flex h-full flex-grow mx-auto overflow-y-scroll">
        {children}
      </main>
      <footer className="bg-red-500 text-xs text-center">
        <p className="m-2">(C)2019 Paradox Inversion Press</p>
      </footer>
    </div>
  );
}

export default Layout;
