import { gql } from "@apollo/client";

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($id: ID!) {
    getVoteUsingVote_post_id_fkey(id: $id) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`;

export const GET_VOTE_BY_USER_AND_POST_ID = gql`
  query MyQuery($username: String!, $post_id: ID!) {
    getVotebyUser_post_id(username: $username, post_id: $post_id) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`;
export const GET_POST_BY_ID = gql`
  query MyQuery($id: ID!) {
    getPost(id: $id) {
      body
      created_at
      id
      image
      root_id
      title
      username
      comment {
        created_at
        id
        post_id
        text
        username
      }
      root {
        created_at
        id
        topic
      }
      vote {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      root_id
      title
      username
      root {
        topic
        id
        created_at
      }
      comment {
        created_at
        id
        text
        username
        post_id
      }
      vote {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListbyTopic(topic: $topic) {
      body
      created_at
      id
      image
      root_id
      title
      username
      comment {
        created_at
        id
        post_id
        text
        username
      }
      root {
        created_at
        id
        topic
      }
      vote {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;
export const GET_ROOT_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getRootListLimit(limit: $limit) {
      created_at
      id
      topic
    }
  }
`;
export const GET_ROOT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getRootListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
