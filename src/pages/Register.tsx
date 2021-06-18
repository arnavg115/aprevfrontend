import {
  Avatar,
  Button,
  Input,
  Spacer,
  Text,
  useToasts,
} from "@geist-ui/react";
import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { setToken } from "../accessToken";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
  useRegisterMutation,
} from "../generated/graphql";
import "../styles/globals.css";

export const Register: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [uri, setURI] = useState("");
  const [register] = useRegisterMutation();
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });
  const [login] = useLoginMutation();
  const [, setToasts] = useToasts();
  useEffect(() => {
    document.title = "Register";
  }, []);
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
    if (
      password === passwordConf &&
      email !== "" &&
      password !== "" &&
      passwordConf !== ""
    ) {
      console.log("form submitted");
      try {
        const { errors } = await register({
          variables: {
            email,
            password,
            uri:
              uri === ""
                ? "https://i1.wp.com/norrismgmt.com/wp-content/uploads/2020/05/24-248253_user-profile-default-image-png-clipart-png-download.png?ssl=1"
                : uri,
          },
        });
      } catch (err) {
        if (err) {
          setToasts({ type: "error", text: JSON.stringify(err) });
        }
      }
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
        if (resp && resp.data && !resp.errors) {
          setToken(resp.data.login.accessToken);
        }
      } catch (err) {
        console.log(err);
        alert(err);
      }
      history.push("/");
    } else {
      setToasts({
        type: "error",
        text: "The passwords do not match or one or more of the input fields are blank",
      });
      setPassword("");
      setPasswordConf("");
    }
  };
  return (
    <div className="s">
      <div className="boc">
        <Text h2>Register</Text>
        <Input
          value={email}
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          size="large"
        />
        <Spacer y={0.5} />
        <Input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          size="large"
        />
        <Spacer y={0.5} />
        <Input
          type="password"
          value={passwordConf}
          placeholder="password confirmation"
          onChange={(e) => {
            setPasswordConf(e.target.value);
          }}
          size="large"
        />
        <Spacer y={0.5} />
        <Input
          icon={<Avatar src={uri} size="mini" />}
          value={uri}
          placeholder="image url"
          size="large"
          onChange={(e) => {
            setURI(e.target.value);
          }}
        />
        <Spacer y={0.5} />
        <Button
          type="success"
          size="small"
          onClick={async () => {
            await submit();
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
};
