import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint, endpointProd } from '../config';
import { LOCAL_STATE_QUERY } from '../components/SoundEffect';
import { ANSWERED_QUESTIONS_QUERY } from '../components/GameScreen';
import gql from 'graphql-tag';

// Setup for SSR w/ next and config endpoint
function createClient({ headers }) {
  const typeDefs = gql`
    type StudyQuestion {
      data: Json
    }
  `;
  const client = new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpointProd,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    typeDefs,
    // cache
    clientState: {
      resolvers: {
        Mutation: {
          toggleSound(_, variables, { cache }) {
            // read the soundOn value from the cache
            const { soundOn } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            // Toggle sound on || off
            const data = {
              data: { soundOn: !soundOn },
            };
            cache.writeData(data);
            return data;
          },
          addAnswered(_, { id, val }, { cache }) {
            // read the answered questions from the cache
            const { answeredQuestions } = cache.readQuery({
              query: ANSWERED_QUESTIONS_QUERY,
            });
            const newQuestion = { id, val, __typename: 'StudyQuestion' };
            const jsonified = JSON.stringify([
              newQuestion,
              ...answeredQuestions,
            ]);
            // Add new question to data
            const data = {
              data: {
                answeredQuestions: [newQuestion, ...answeredQuestions],
              },
            };

            cache.writeData(data);
            return data;
          },
          resetBoard(_, variables, { cache }) {
            // Reset answered questions
            const data = {
              data: {
                answeredQuestions: [],
              },
            };
            cache.writeData(data);
            return data;
          },
        },
      },
      defaults: {
        soundOn: false,
        answeredQuestions: [],
      },
    },
  });
  return client;
}

export default withApollo(createClient);
