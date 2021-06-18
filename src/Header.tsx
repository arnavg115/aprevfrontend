import { Button, Spacer, Text, Loading, Avatar } from "@geist-ui/react";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { setToken } from "./accessToken";
import { useLogoutMutation, useMeQuery } from "./generated/graphql";
import "./styles/globals.css";

export default function Header(props: any) {
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });
  const [logout, { client }] = useLogoutMutation();
  const Navbar: FC = () => {
    if (loading) {
      return <Loading size="large" />;
    } else if (!data || !data.me) {
      return (
        <div className="g">
          <div className="ns">
            <Link to="/" className="branding">
              <Text h4>APrev</Text>
            </Link>
            <Link to="/login" className="random">
              <Text h4>Login</Text>
            </Link>
            <Link to="/register" className="random">
              <Text h4>Register</Text>
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="g">
          <div className="ns">
            <Link to="/" className="branding">
              <Text h4>APrev</Text>
            </Link>
            <Link to="/addclass" className="random">
              <Text h4>Add</Text>
            </Link>
          </div>
          <div className="na">
            <Avatar src={data.me.uri} size="mini" />
            <Spacer x={1} />
            <h4 className="wh">{data.me.email}</h4>
            <Spacer x={4} />
            <Button
              onClick={async () => {
                await logout();
                setToken("");
                await client.resetStore();
                window.location.reload();
              }}
              type="success"
            >
              Logout
            </Button>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="jss">
      <Navbar />
    </div>
  );
}
