import react, { useEffect, useReducer } from "react";
import shortid from "shortid";
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

const useSPList = ({ ctx }) => {
  const initialState = {
    isError: false,
    isLoading: false,
    data: []
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);
  const ctx = spscript.createContext(ctx);

//   const add = async item => {
//     dispatch({ type: "REQUEST_INIT" });
//     try {
//       return new Promise(resolve => {
//         resolve(
//           (async function() {
//             let data = await ctx.lists(listName).addItem(payload);
//             dispatch({ type: "REQUEST_SUCCESS", payload: data });
//             return data;
//           })()
//         );
//       });
//     } catch (error) {
//       dispatch({ type: "REQUEST_FAILURE" });
//       throw new Error(error);
//     }
//   };

  const list = (listName) => {
      var spList;
      
      var functions = {
          substring = (text) => {
            spList += text
            return this
          },
          exact = (text) => {
            spList += text
            return this
          },
          doIt = () => {
            return spList
          }
      }
      return functions
  } 


  return {
    list: list,
  };
};

export default useSPList;
