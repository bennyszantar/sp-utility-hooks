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

const makeOdata = fields => {
  let odata = "$filter=";

  fields.map((field, index) => {
    index === 0
      ? (odata += `(EntityPropertyName eq '${field}')`)
      : (odata += `or (EntityPropertyName eq '${field}')`);
  });

  return odata;
};

const getEnumValues = data => {
  let listOfDictionaries = {};
  data.map((item, index) => {
    listOfDictionaries = {
      ...listOfDictionaries,
      [item.EntityPropertyName]: item.Choices.results.map(item => {
        return { key: item, value: item };
      })
    };
  });
  return listOfDictionaries;
};

const useSPDictionaryFetch = ({
  ctx,
  fields,
  listName,
  orderField,
  orderMode
}) => {
  const initialState = {
    isError: false,
    isLoading: false,
    data: []
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);

  const fetchDictionary = async () => {
    dispatch({ type: "REQUEST_INIT" });
    try {
      const spCtx = spscript.createContext(ctx);
      let data = await spCtx.get(
        `/web/lists/GetByTitle('${listName}')/fields?${makeOdata(
          fields
        )}&$orderby=${orderField || "Title"} ${orderMode || "asc"}`
      );

      dispatch({
        type: "REQUEST_SUCCESS",
        payload: getEnumValues(data.d.results)
      });
    } catch (error) {
      dispatch({ type: "REQUEST_FAILURE" });
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchDictionary();
  }, []);

  return [state, fetchDictionary];
};

export default useSPDictionaryFetch;
