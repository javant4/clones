import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $root_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      root_id: $root_id
      title: $title
      username: $username
    ) {
      body
      created_at
      id
      image
      root_id
      title
      username
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation($username: String!, $post_id: ID!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, upvote: $upvote, username: $username) {
      id
      created_at
      post_id
      upvote
      username
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation MyMutation(
    $id: ID!
    $post_id: ID!
    $upvote: Boolean!
    $username: String!
  ) {
    updateVote(
      id: $id
      post_id: $post_id
      upvote: $upvote
      username: $username
    ) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation($username: String!, $post_id: ID!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      created_at
      id
      text
      username
      post_id
    }
  }
`;

export const ADD_ROOT = gql`
  mutation MyMutation($topic: String!) {
    insertRoot(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
