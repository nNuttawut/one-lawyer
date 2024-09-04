import { GET_DATA } from "../../action/DataImport";

const initState = {
  data: null,
};

const dataImport = (state = initState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        data: action.payload.data,
      };
    default:
      return state;
  }
};

export default dataImport;
