import { Reducer, Dispatch } from "redux";
import { ofetch } from "ofetch";
import { z } from "zod";

type Act<T extends string, P = undefined> = P extends undefined
  ? { type: T }
  : {
      type: T;
      payload: P;
    };

export namespace Users {
  // types
  export type User = {
    id: number;
    name: string;
    username?: string;
    email: string;
    address?: { city: string };
  };

  type FetchStatus = "ok" | "pending" | "error" | "idle";

  type UserFormData = { name: string; email: string };
  type Validation = "idle" | "valid" | "invalid";
  type UserFormValidation = {
    name: Validation;
    email: Validation;
    isValid: boolean;
  };
  export type UserForm = {
    data: UserFormData;
    validation: UserFormValidation;
    show: boolean;
  };

  type State = {
    list: User[] | null;
    fetchStatus: FetchStatus;
    updateTime: number | null;
    forms: {
      addUser: UserForm;
      editUser: UserForm;
    };
  };

  type Action =
    | Act<"users/update", { list: User[]; updateTime: number }>
    | Act<"users/fetch-pending">
    | Act<"users/fetch-error">
    | Act<"users/add-form/input", { name: string; email: string }>
    | Act<"users/edit-form/input", { name: string; email: string }>
    | Act<"users/add-form/validate">
    | Act<"users/edit-form/validate">
    | Act<"users/add-form/reset">
    | Act<"users/edit-form/reset">
    | Act<"users/add-form/show">
    | Act<"users/add-form/hide">
    | Act<"users/edit-form/show">
    | Act<"users/edit-form/hide">
    | Act<"users/delete-user", { id: number }>
    | Act<"users/create-user", { name: string; email: string }>
    | Act<"users/edit-user", { id: number; name: string; email: string }>;

  const defaultUserFormDataState = {
    data: { name: "", email: "" },
    validation: { name: "idle", email: "idle", isValid: false } as const,
    show: false,
  };

  const defaultState: State = {
    list: null,
    fetchStatus: "idle",
    updateTime: null,
    forms: {
      addUser: defaultUserFormDataState,
      editUser: defaultUserFormDataState,
    },
  };

  const validateUserForm = (data: UserFormData): UserFormValidation => {
    const validate = (data: any, schema: z.ZodTypeAny) =>
      schema.safeParse(data).success ? "valid" : "invalid";

    const propsValidation = {
      name: validate(data.name, z.string().min(1)),
      email: validate(data.email, z.string().email()),
    } as const;

    return {
      ...propsValidation,
      isValid: Object.values(propsValidation).every((v) => v === "valid"),
    };
  };

  export const reducer: Reducer<State, Action> = (
    state = defaultState,
    action
  ) => {
    switch (action.type) {
      case "users/update": {
        return {
          ...state,
          list: action.payload.list,
          updateTime: action.payload.updateTime,
        };
      }
      case "users/fetch-pending": {
        return { ...state, fetchStatus: "pending" };
      }
      case "users/fetch-error": {
        return { ...state, fetchStatus: "error" };
      }
      case "users/add-form/input": {
        return {
          ...state,
          forms: {
            ...state.forms,
            addUser: {
              data: action.payload,
              validation: state.forms.addUser.validation,
              show: true,
            },
          },
        };
      }
      case "users/edit-form/input": {
        return {
          ...state,
          forms: {
            ...state.forms,
            editUser: {
              data: action.payload,
              validation: state.forms.editUser.validation,
              show: true,
            },
          },
        };
      }
      case "users/add-form/validate": {
        return {
          ...state,
          forms: {
            ...state.forms,
            addUser: {
              data: state.forms.addUser.data,
              validation: validateUserForm(state.forms.addUser.data),
              show: true,
            },
          },
        };
      }
      case "users/edit-form/validate": {
        return {
          ...state,
          forms: {
            ...state.forms,
            editUser: {
              data: state.forms.editUser.data,
              validation: validateUserForm(state.forms.editUser.data),
              show: true,
            },
          },
        };
      }
      case "users/add-form/show": {
        // const forms = structuredClone(state.forms) as typeof state.forms;
        // forms.addUser.show = true;
        return {
          ...state,
          forms: {
            ...state.forms,
            addUser: { ...state.forms.addUser, show: true },
          },
        };
      }
      case "users/add-form/hide": {
        return {
          ...state,
          forms: {
            ...state.forms,
            addUser: { ...state.forms.addUser, show: false },
          },
        };
      }
      case "users/edit-form/show": {
        return {
          ...state,
          forms: {
            ...state.forms,
            editUser: { ...state.forms.editUser, show: true },
          },
        };
      }
      case "users/edit-form/hide": {
        return {
          ...state,
          forms: {
            ...state.forms,
            editUser: { ...state.forms.editUser, show: false },
          },
        };
      }
      case "users/add-form/reset": {
        return {
          ...state,
          forms: {
            ...state.forms,
            addUser: defaultUserFormDataState,
          },
        };
      }
      case "users/edit-form/reset": {
        return {
          ...state,
          forms: {
            ...state.forms,
            editUser: defaultUserFormDataState,
          },
        };
      }
      case "users/edit-user": {
        if (!state.list) return state;
        const userList = structuredClone(state.list) as User[];
        const userIndex = userList.findIndex((u) => u.id == action.payload.id);
        userList[userIndex] = { ...userList[userIndex], ...action.payload };
        return {
          ...state,
          list: userList,
        };
      }
      case "users/create-user": {
        if (!state.list) return state;
        return {
          ...state,
          list: [
            { ...action.payload, id: state.list.length + 1 },
            ...state.list,
          ],
        };
      }
      case "users/delete-user": {
        if (!state.list) return state;
        return {
          ...state,
          list: state.list.filter((u) => u.id !== action.payload.id),
        };
      }
      default: {
        return state;
      }
    }
  };

  // Action Creators
  const fetchPending = (): Action => ({ type: "users/fetch-pending" });
  const fetchError = (): Action => ({ type: "users/fetch-error" });
  const updateUsers = (data: User[]): Action => ({
    type: "users/update",
    payload: { list: data, updateTime: Date.now() },
  });

  export const inputAddUserFormData = (data: UserFormData): Action => ({
    type: "users/add-form/input",
    payload: data,
  });
  export const inputEditUserFormData = (data: UserFormData): Action => ({
    type: "users/edit-form/input",
    payload: data,
  });
  export const validateAddUserForm = (): Action => ({
    type: "users/add-form/validate",
  });
  export const validatEditUserForm = (): Action => ({
    type: "users/edit-form/validate",
  });
  export const resetAddUserForm = (): Action => ({
    type: "users/add-form/reset",
  });
  export const resetEditUserForm = (): Action => ({
    type: "users/edit-form/reset",
  });
  export const showAddUserForm = (): Action => ({
    type: "users/add-form/show",
  });
  export const hideAddUserForm = (): Action => ({
    type: "users/add-form/hide",
  });
  export const showEditUserForm = (): Action => ({
    type: "users/edit-form/show",
  });
  export const hideEditUserForm = (): Action => ({
    type: "users/edit-form/hide",
  });
  const deleteUser = (id: number): Action => ({
    type: "users/delete-user",
    payload: { id },
  });
  const createUser = (data: { name: string; email: string }): Action => ({
    type: "users/create-user",
    payload: data,
  });
  const editUser = (data: {
    id: number;
    name: string;
    email: string;
  }): Action => ({ type: "users/edit-user", payload: data });

  // Async Actions
  export const fetchUsers = () => {
    return async (dispatch: Dispatch<Action>) => {
      dispatch(fetchPending());
      try {
        const data: User[] = await ofetch(
          "https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data",
          { retry: 3 }
        );
        dispatch(updateUsers(data));
      } catch {
        dispatch(fetchError());
      }
    };
  };

  export const submitAddUser = () => {
    return async (
      dispatch: Dispatch<Action>,
      getState: () => { users: State }
    ) => {
      dispatch(validateAddUserForm());
      const addUserForm = getState().users.forms.addUser;
      if (addUserForm.validation.isValid) {
        try {
          await ofetch(
            "https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data",
            { method: "POST", body: addUserForm.data }
          );
          dispatch(createUser(addUserForm.data));
          dispatch(resetAddUserForm());
        } catch {}
      }
    };
  };

  export const submitEditUser = (userId: number) => {
    return async (
      dispatch: Dispatch<Action>,
      getState: () => { users: State }
    ) => {
      dispatch(validatEditUserForm());
      const editUserForm = getState().users.forms.editUser;
      if (editUserForm.validation.isValid) {
        try {
          await ofetch(
            `https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data/${userId}`,
            { method: "PATCH", body: editUserForm.data }
          );
          dispatch(editUser({ ...editUserForm.data, id: userId }));
          dispatch(resetEditUserForm());
        } catch {}
      }
    };
  };

  export const submitDeleteUser = (userId: number) => {
    return async (dispatch: Dispatch<Action>) => {
      try {
        await ofetch(
          `https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data/${userId}`,
          { method: "DELETE" }
        );
        dispatch(deleteUser(userId));
      } catch {}
    };
  };
}
