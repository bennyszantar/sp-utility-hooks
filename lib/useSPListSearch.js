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

const useSPListSearch = ({
  ctx,
  listName,
  fieldName,
  searchType,
  searchCondition,
  selectFields,
  expandFields,
  top,
  order,
  odata,
  initSearch,
  initSearchQuery
}) => {
  const initialState = {
    isError: false,
    isLoading: false,
    data: []
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);
  const search = async (query, overrideField) => {
    dispatch({ type: "REQUEST_INIT" });

    try {
      return new Promise(async resolve => {
        const spCtx = spscript.createContext(ctx);
        let data = [];
        let searchMode = (query.length > 0 || Number.isInteger(query) ) ? searchType : "listAll";
        let searchedField = overrideField || fieldName;
        switch (searchMode) {
          case "number":
            resolve(data = await spCtx
              .lists(listName)
              .getItems(
                `$select=*${selectFields ||
                  ""}&$filter=${searchedField} ${searchCondition ||
                  "eq"} ${query}${odata ||
                  ""}&$orderby=${searchedField} ${order || "asc"}${expandFields?'&$expand=':''}${expandFields || ''}&$top=${top ||
                  10}`
              ));
            break;
          case "exactString":
            resolve(data = await spCtx
              .lists(listName)
              .getItems(
                `$select=*${selectFields ||
                  ""}&$filter=${searchedField} eq '${query}'${odata ||
                  ""}&$orderby=${searchedField} ${order || "asc"}${expandFields?'&$expand=':''}${expandFields || ''}&$top=${top ||
                  10}`
              ));
            break;
          case "substring":
            resolve(data = await spCtx
              .lists(listName)
              .getItems(
                `$select=*${selectFields ||
                  ""}&$filter=substringof('${query}',${searchedField})${odata ||
                  ""}&$orderby=${searchedField} ${order || "asc"}${expandFields?'&$expand=':''}${expandFields || ''}&$top=${top ||
                  10}`
              ));
            break;
          case "listAll":
            resolve(data = await spCtx
              .lists(listName)
              .getItems(
                `$select=*${selectFields ||
                  ""}&$orderby=${searchedField} ${order || "asc"}${expandFields?'&$expand=':''}${expandFields || ''}&$top=${top || 10}`
              ));
        }

        dispatch({
          type: "REQUEST_SUCCESS",
          payload: data
        });

        })
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE" });
     throw new Error(error);
    }
  };
  useEffect(() => {
    initSearch && search(initSearchQuery || "");
  }, [initSearch]);

  return [state, search];
};

export default useSPListSearch;
