import { useEffect } from "react";
import useSWR from "swr";
import Auth from "../hooks/useAuthentication";
import UserProjects from "../hooks/useProjects";
import fetcher from "../utils/fetcher";
import Link from "next/link";
import Sidebar from "./Sidebar";
function Layout({ children }) {
  const UserData = Auth.useContainer();
  const UserProjectData = UserProjects.useContainer();
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
      {/* <header className="bg-red-500 flex">
        <p className="p-2 font-bold text-lg text-center">
          Story Tool <em>Next</em>
        </p>
      </header> */}
      <div className="main-container max-h-full h-full grid grid-cols-12 auto-cols-min">
        {UserData.user && <Sidebar />}
        <main className="md:col-start-3 col-span-full">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
