import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
} from "../generated/graphql";

import { setToken } from "../accessToken";
import { Button, Input, Spacer, Text } from "@geist-ui/react";
import "../styles/globals.css";

export const Login: FC<RouteComponentProps> = ({ history }) => {
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const submit = async () => {
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
    console.log(resp);
  };
  return (
    <div className="s">
      <div className="boc">
        <Text h2>Login</Text>
        <Input
          className="sdf"
          value={email}
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          size="large"
        />
        <Spacer y={0.5} />
        <Input.Password
          value={password}
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          size="medium"
        />
        <Spacer y={0.5} />
        <Button
          onClick={async () => {
            await submit();
          }}
          type="success"
          size="small"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
