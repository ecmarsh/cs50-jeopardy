import styled from 'styled-components';

const Frame = styled.div`
  position: relative;
  text-align: left;
  padding-top: 0.4rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
  color: ${props => props.theme.darkGrey};
  fill: ${props => props.theme.red};
`;

export default Frame;
