import styled, { css } from 'styled-components';

const PaginationStyled = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  padding: 1rem 20%;
  margin: 0 auto;
  line-height: 1;

  a,
  a:visited {
    border: 0px solid ${props => props.theme.primary};
    min-height: 100%;
    font-size: smaller;
    color: ${props => props.theme.primary};
    &[aria-disabled='true'] {
      visibility: hidden;
    }
    span {
      padding: 0 3px;
      transform: translate3d(0, 0, 0);
      display: inline-block;
      opacity: 1;
      transition: transform 0.2s cubic-bezier(0.04, 1.16, 0.96, 1.03);
    }
  }

  a.prev {
    order: 0;

    &:hover {
      span {
        transform: translate3d(-3px, 0, 0);
      }
    }
  }
  a.next {
    order: 2;

    &:hover {
      span {
        transform: translate3d(3px, 0, 0);
      }
    }
  }

  h2,
  h3,
  h4,
  h5 {
    order: 1;
  }

  ${props =>
    props.breadcrumb &&
    css`
      padding: 1.5rem 10%;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0;
      line-height: 2;
      a,
      a:visited {
        color: ${props => props.theme.black};
        opacity: 0.8;
        font-size: 0.7em;
        padding-top: 1rem;

        &:hover {
          opacity: 1;
        }
      }
    `}
`;

export default PaginationStyled;
