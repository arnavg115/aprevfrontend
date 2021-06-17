import React, { FC, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetOneQuery,
  useMeQuery,
  useAddCommentMutation,
} from "../generated/graphql";

export const ViewClass: FC = () => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [addComment, { client }] = useAddCommentMutation();
  const me = useMeQuery({ fetchPolicy: "network-only" });
  //   @ts-ignore
  let { id } = useParams();
  const { data, error, loading } = useGetOneQuery({
    fetchPolicy: "network-only",
    variables: {
      className: id ? id : "",
    },
  });
  if (loading) {
    return <p>Loading</p>;
  } else if (error || !data || !data.getOneClass) {
    return <p>There has been an error with your request {error?.message}</p>;
  }
  const addComm = async () => {
    if (rating === "" || comment === "") {
      alert("No comment or rating entered");
    } else {
      const res = await addComment({
        variables: {
          ownerClass: id,
          rating: isNaN(parseInt(rating)) ? 1 : parseInt(rating),
          comment: comment,
        },
      });
      client.resetStore();
      setComment("");
      setRating("");
      console.log(data.getOneClass.total);
    }
  };
  const commentsArea = () => {
    if (me.loading) {
      return <p>Loading</p>;
    } else if (!me.data || !me.data.me || me.error) {
      return <p>Error {me.error?.message}</p>;
    }
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addComm();
        }}
      >
        <input
          placeholder="Rating 1-5"
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
          }}
        />
        <input
          placeholder="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button type="submit">Comment</button>
      </form>
    );
  };
  return (
    <div>
      <p>{data.getOneClass.name}</p>
      <p>{data.getOneClass.description}</p>
      <p>
        rating:{" "}
        {data.getOneClass.nums !== 0
          ? data.getOneClass.total / data.getOneClass.nums
          : 0}
      </p>
      <ul>
        {data.getOneClass.comments.map((x) => (
          <li key={x.id}>
            {x.comment} with a rating of {x.rating}
          </li>
        ))}
      </ul>
      {commentsArea()}
    </div>
  );
};
