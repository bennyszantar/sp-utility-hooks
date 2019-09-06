import React, {useContext, useState, useEffect } from "react";
import spscript from "spscript-b";
import config from "../config";

const CurrentUserContext = React.createContext();
const PermissionMapContext = React.createContext();

const SecurityProvider = ({ children, aclModel, Loader }) => {
  const [user, setUser] = useState({});
  const [isAuthorising, setIsAuthorising] = useState(true);
  useEffect(() => {
    const spCtx = spscript.createContext(config.contextUrl);
    spCtx.get("/web/currentuser/?$expand=groups").then(user => {
      setUser(user.d);
      setIsAuthorising(false);
    });
  }, []);

  return (
    <>
      {isAuthorising ? (
        <>{Loader && 
              { ...Loader }            
          }
        </>
      ) : (
        <CurrentUserContext.Provider value={user}>
          <PermissionMapContext.Provider value={aclModel}>
            {children}
          </PermissionMapContext.Provider>
        </CurrentUserContext.Provider>
      )}
    </>
  );
};

const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error(
      "CurrentUserContext must be used under SecurityProvider"
    );
  }
  return context;
};

const flatUserGroups = groups => {
  let flatGroups = [];
  groups.map(group => {
    flatGroups.push(group.LoginName);
  });

  return flatGroups;
};

const checkIfGroupIsAllowed = (userGroups, authGroups) => 
  userGroups.some(group => {
    if (authGroups.indexOf(group) === 0) return true;
  })

const usePermissionCheck = () => {
  const user = useContext(CurrentUserContext);
  const aclMap = useContext(PermissionMapContext);

  if (user === undefined) {
    throw new Error(
      "CurrentUserContext must be used under SecurityProvider"
    );
  }

  if (aclMap === undefined) {
    throw new Error("You must pass security model for SecuritProvider");
  }

  const userGroups = (user.Groups && flatUserGroups(user.Groups.results)) || [];

  const can = (action, ability) => {
    let isAuthorised = false;

    aclMap.map(acl => {
      if (acl.action !== action) return;

      acl.permissions.map(perm => {
        if (perm.can !== ability) return;
        if (checkIfGroupIsAllowed(userGroups, perm.who)) isAuthorised = true;
      });
    });

    return isAuthorised;
  };

  return {can, user};
};

export { SecurityProvider, useCurrentUser, usePermissionCheck };
