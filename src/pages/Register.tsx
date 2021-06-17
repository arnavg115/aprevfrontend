import { Spacer } from "@geist-ui/react";
import React, { FC, useState } from "react";
import { RouteComponentProps } from "react-router";
import { setToken } from "../accessToken";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
  useRegisterMutation,
} from "../generated/graphql";

export const Register: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });
  const [login] = useLoginMutation();
  if (!loading && data && data.me) {
    return (
      <div>
        {(() => {
          history.push("/");
        })()}
        Redirecting
      </div>
    );
  }
  return (
    <div>
      <Spacer y={4} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submitted");
          await register({
            variables: {
              email,
              password,
            },
          });

          let resp;
          try {
            resp = await login({
              variables: {
                email,
                password,
              },
              update: (store, { data }) => {
                if (!data) {
                  return null;
                }
                store.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    me: data.login.user,
                  },
                });
              },
            });
            if (resp && resp.data) {
              setToken(resp.data.login.accessToken);
            }
          } catch (err) {
            console.log(err);
          }
          history.push("/");
        }}
      >
        <div>
          <input
            value={email}
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            value={password}
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">register</button>
        </div>
      </form>
    </div>
  );
};
