import React, {useContext, useState, useEffect } from "react";
import spscript from "spscript-b";

const SpContext = React.createContext();
const CurrentUserContext = React.createContext();
const PermissionMapContext = React.createContext();

const SecurityProvider = ({ children, aclModel, Loader, ctx }) => {
  const [user, setUser] = useState({});
  const [userAdGroups, userAdGroups] = useState({});

  const [isAuthorising, setIsAuthorising] = useState(true);
  useEffect(() => {
    const spCtx = spscript.createContext(ctx);
    spCtx.get("/web/currentuser/?$expand=groups").then(user => {
      let userObject = user;
      setIsAuthorising(false);
      aclModel.map(async group => {
        await Promise.all(group.map(async permission => {
          spCtx.get(`/web/sitegroups/getbyname('${permission.who}')/CanCurrentUserViewMembership`)
          .then(r => {
            if(r.d.CanCurrentUserViewMembership){
              userObject.Groups.results.push({
                isAdGroup: true,
                LoginName: permission.who
              })
            }  
          })
        }))
    })
    setUser(userObject)
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


const usePermissionCheck = () => {
  const user = useContext(CurrentUserContext);
  const aclMap = useContext(PermissionMapContext);
  const ctx = useContext(SpContext);

  if (user === undefined) {
    throw new Error(
      "CurrentUserContext must be used under SecurityProvider"
    );
  }

  if (aclMap === undefined) {
    throw new Error("You must pass security model for SecuritProvider");
  }

  const userGroups = (user.Groups && flatUserGroups(user.Groups.results)) || [];


  const checkIfGroupIsAllowed = (userGroups, authGroups) => 
  userGroups.some(async group => {
    if (authGroups.indexOf(group) === 0) return true;
  })

  const can = (action, ability) => {
    let isAuthorised = false;

    aclMap.map(acl => {
      if (isAuthorised) return isAuthorised
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
