import React, { FC, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  useAddClassMutation,
  useGetClassesQuery,
  useMeQuery,
} from "../generated/graphql";

export const AddClass: FC<RouteComponentProps> = ({ history }) => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const all = useGetClassesQuery({ fetchPolicy: "network-only" });
  const { data, loading, error } = useMeQuery({ fetchPolicy: "network-only" });
  const [addClass] = useAddClassMutation();
  if (loading || all.loading) {
    return <div>Loading</div>;
  } else if (!data || !data.me || error) {
    return (
      <div>
        {(() => {
          history.push("/login");
        })()}
        Redirecting
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const resp = await addClass({
            variables: {
              className: className,
              description: description,
            },
          });
          if (!resp.errors && resp.data && resp.data.addClass) {
            history.push("/");
          }
        }}
      >
        <input
          type="text"
          value={className}
          placeholder="Class Name"
          onChange={(e) => {
            setClassName(e.target.value);
          }}
        />
        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
