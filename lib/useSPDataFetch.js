import react, { useEffect, useReducer } from "react";

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

const useSPDataFetch = ({
  ctx,
  listName,
  odata,
  baseUrl,
  payload,
  waitForPayload,
  lazy,
}) => {
  const initialState = {
    isError: false,
    isLoading: false,
    data: [],
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);
  const fetchData = async (overrideOdata) => {
    dispatch({ type: "REQUEST_INIT" });

    try {
      const spCtx = spscript.createContext(baseUrl + ctx);
      let data = [];

      if (waitForPayload && !payload) return;
      if (lazy)
        return new Promise(resolve => {
          let decoratedData = []
          resolve(
            (async function() {
              let data = await spCtx.lists(listName).getItems(overrideOdata || odata);
              dispatch({ type: "REQUEST_SUCCESS", payload: decoratedData = data.map(item => {
                return {
                  ...item,
                  SPWebUrl: spCtx.webUrl.trim(),
                  SPListName: listName
                }; 
              }) });
            })()
          );
      });

     
       data = await spCtx.lists(listName).getItems(odata)
      
      
      let decoratedData = data.map(item => {
        return {
          ...item,
          SPWebUrl: spCtx.webUrl.trim(),
          SPListName: listName
        };
      });
      dispatch({ type: "REQUEST_SUCCESS", payload: decoratedData });
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE" });
      throw new Error(error);
    }
  };

  useEffect(() => {

    !lazy && fetchData();
  }, [payload]);

  return [state, fetchData];
};

export default useSPDataFetch;
