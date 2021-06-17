import React, { FC } from "react";
import { useGetClassesQuery } from "../generated/graphql";
import { Link } from "react-router-dom";
import { Card, Col, Row, Spacer, Text, Progress } from "@geist-ui/react";
import "../styles/globals.css";
import _ from "lodash";

export const Home: FC = () => {
  const all = useGetClassesQuery({ fetchPolicy: "network-only" });

  return (
    <div>
      <Spacer y={4} />
      <Text
        h1
        style={{
          marginLeft: "30px",
        }}
      >
        Classes
      </Text>
      <Spacer y={2} />
      <div className="cards">
        {_.chunk(all.data?.ListClasses, 2).map((x) => {
          return (
            <Row gap={0.8} style={{ marginBottom: "20px" }}>
              {x.map((y) => (
                <Col span={25}>
                  <Link to={"/view/" + y.name}>
                    <Card shadow className="round">
                      <Text h2>{y.name}</Text>
                      <Text h5 type="secondary">
                        {y.description}
                      </Text>
                      <Spacer y={2} />
                      <Progress
                        value={y.nums !== 0 ? (y.total / y.nums) * 20 : 0}
                        type="success"
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          );
        })}
      </div>
    </div>
  );
};
