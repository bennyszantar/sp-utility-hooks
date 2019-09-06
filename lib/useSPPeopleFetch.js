import react, { useEffect, useReducer } from "react";
import shortid from 'shortid';
import spscript from "spscript-b";

const apiReducer = (state, action) => {
  switch (action.type) {
    case "REQUEST_INIT":
      return {
        ...state,
        isLoading: true,
        data: []
      };
    case "REQUEST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "REQUEST_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const useSPPeopleFetch = ({ ctx }) => {
  const initialState = {
    isError: false,
    isLoading: false,
    data: []
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);
  const fetchUsers = async query => {
    dispatch({ type: "REQUEST_INIT" });
    try {
      if(query.length < 3) return;
      
      const spCtx = spscript.createContext(ctx);

      let data = await spCtx.search.people(query);
      
      dispatch({ type: "REQUEST_SUCCESS", payload: data.items.map((people,index) => {
          return {
              key:shortid.generate(),
              combinedName: people.PreferredName.substr(0,people.PreferredName.indexOf('[')-1),
              workCompany: people.PreferredName.substr(people.PreferredName.indexOf('['),people.PreferredName.length),
              ...people     
          }
      }) 
    });
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE" });
      throw new Error(error);
    }
  };

  return [state, fetchUsers];
};

export default useSPPeopleFetch;
