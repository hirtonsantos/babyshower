import {
  PARENT_FAIL,
  PARENT_LOADING,
  PARENT_SUCCESS,
  ParentDispatchTypes,
} from "./actionTypes";

import { IUser } from "../../../interfaces/user";
import jwt_decode, { JwtPayload } from "jwt-decode";
import api from "../../../Services/api";

interface DefaultStateI {
  loading: boolean;
  dataUser: Partial<IUser> | undefined;
}

const defaultState: DefaultStateI = {
  loading: false,
  dataUser: undefined,
};

const parentReducer = (state = defaultState, action: ParentDispatchTypes) => {
  switch (action.type) {
    case PARENT_FAIL:
      return { ...defaultState, loading: false };
    case PARENT_LOADING:
      return { ...defaultState, loading: true };
    case PARENT_SUCCESS:
      return {
        loading: false,
        dataUser: action.payload,
      };
    default:
      return state;
  }
};

export default parentReducer;