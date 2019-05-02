import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AddToCategory from './CategoryQuestionAdd';
import { categoriesPerPage } from '../config';

const CATEGORY_QUESTIONS_QUERY = gql`
  query CATEGORY_QUESTIONS_QUERY($categoryId: ID) {
    categoryQuestions(where: { category: { id: $categoryId } }) {
      id
      difficulty
      isDouble
      answered
      question {
        id
        question
        answer
      }
      category {
        id
        name
      }
    }
  }
`;

const CategoryQuestions = ({ gameName, categoryId, round }) => (
  <Query query={CATEGORY_QUESTIONS_QUERY} variables={{ categoryId }}>
    {({ data, error }) => {
      if (error) return <p>Error...</p>;
      if (data.categoryQuestions)
        return (
          <>
            {data.categoryQuestions.map((categoryQuestion, index) => (
              <AddToCategory
                key={categoryQuestion.id}
                gameName={gameName}
                categoryId={categoryId}
                categoryName={categoryQuestion.category.name}
                categoryQuestionId={categoryQuestion.id}
                difficulty={categoryQuestion.difficulty}
                question={categoryQuestion.question}
                loaded={categoryQuestion.question !== null}
                skip={categoriesPerPage * (round - 1)}
                cacheCategoryIndex={index}
              />
            ))}
          </>
        );
    }}
  </Query>
);

export default CategoryQuestions;
export { CATEGORY_QUESTIONS_QUERY };
