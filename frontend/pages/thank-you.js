import QuestionConfirm from '../components/QuestionConfirm';

const ConfirmationPage = ({ query }) => (
  <div>
    <QuestionConfirm id={query.id} updated={query.updated} />
  </div>
);

export default ConfirmationPage;
