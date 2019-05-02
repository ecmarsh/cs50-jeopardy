import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import LeftList from './styles/List';
import LeftListItem from './styles/ListItem';
import { format } from 'date-fns';
import Error from './ErrorMessage';
import { TextMuted } from './styles/Utilities';
import styled from 'styled-components';
import DeleteQuestion from './QuestionDelete';
import hexToRgb from '../lib/hexToRgb';

const GAME_QUESTIONS_QUERY = gql`
  query GAME_QUESTIONS_QUERY($gameName: String!) {
    questions(where: { game: { name: $gameName } }, orderBy: createdAt_DESC) {
      id
      question
      answer
      createdAt
      user {
        id
        name
      }
      categoryQuestions {
        id
        category {
          id
        }
      }
    }
  }
`;
const DraggableListItem = styled(LeftListItem)`
  cursor: move;
  &:hover {
    cursor: -webkit-grab;
    cursor: grab;
  }
  &:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  &.isInUse {
    background-color: rgba(${props => hexToRgb(props.theme.grey)}, 0.5);
  }
`;

class SubmittedQuestions extends PureComponent {
  handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    // Set data to pass over to drop target
    e.dataTransfer.setData('id', e.target.id);
    e.dataTransfer.setData('question', e.target.dataset.question);
    e.dataTransfer.setData('answer', e.target.dataset.answer);
  };

  render() {
    const { game, round } = this.props;
    return (
      <Query query={GAME_QUESTIONS_QUERY} variables={{ gameName: game }}>
        {({ data, loading, error }) => {
          if (loading) return 'Loading...';
          if (!data) return <Error error={error} />;
          if (!data.questions)
            return (
              <div>
                <h2>No questions yet</h2>
                <Link
                  href={`/submit?game=${game}${
                    round > 1 ? '&round=' + round : ''
                  }`}
                >
                  <a>+ Add Your Own Question</a>
                </Link>
              </div>
            );
          return (
            <LeftList>
              <div className="heading">
                <h3>Submitted Questions</h3>
                <Link
                  href={`/submit?game=${game}${
                    round > 1 ? '&round=' + round : ''
                  }`}
                >
                  <a>+ Add Your Own Question</a>
                </Link>
                <hr />
              </div>

              <ul>
                {data.questions.map((question, i) => (
                  <QuestionListItem
                    key={`${question.id}-${i}`}
                    handleDragStart={this.handleDragStart}
                    question={question}
                    gameName={game}
                    round={round}
                  />
                ))}
              </ul>
            </LeftList>
          );
        }}
      </Query>
    );
  }
}

const QuestionListItem = ({ question, handleDragStart, gameName, round }) => (
  <DraggableListItem
    draggable
    onDragStart={handleDragStart}
    id={question.id}
    data-question={question.question}
    data-answer={question.answer}
    className={question.categoryQuestions.length ? 'isInUse' : ''}
  >
    <div>
      <p style={{ position: 'relative' }}>
        <TextMuted>
          {`${question.user.name} | ${format(
            question.createdAt,
            'MM-DD-YY h:mm a'
          )}`}
        </TextMuted>
        <DeleteQuestion
          questionId={question.id}
          gameName={gameName}
          round={round}
          categoryQuestionsProp={question.categoryQuestions}
        />
      </p>
    </div>
    <div>
      <p>Q: {question.question}</p>
      <p>A: {question.answer}</p>
    </div>
  </DraggableListItem>
);

export default SubmittedQuestions;
export { GAME_QUESTIONS_QUERY };
