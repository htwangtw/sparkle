import styled from 'styled-components';
import { Wrapper as ToggleSwitch } from 'components/atoms/ToggleSwitch/ToggleSwitch.styles';

export const Wrapper = styled.div`
  display: grid;
  height: calc(100vh - 132px);
  grid-template-columns: 240px auto;

  position: relative;
  overflow-y: scroll;

  scrollbar-width: thin;

  .no-venue-selected {
    display: flex;
    justify-self: center;
    align-self: center;

    font-size: 3rem;
  }

  input:disabled {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const ViewWrapper = styled.div`
  padding: 2rem;
`;

export const ItemWrapper = styled.div`
  width: 80%;
  margin-bottom: 2rem;

  position: relative;

  ${ToggleSwitch} {
    margin-bottom: 1rem;
  }
`;

export const ItemHeader = styled.header`
  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: '';
    background-color: ${(props) => props.theme.colors.white};
    height: 1px;
  }

  &::before {
    width: 3rem;
  }

  &::after {
    flex: 1;
  }
`;

export const ItemTitle = styled.h2`
  margin: 0 1rem;
`;

export const ItemBody = styled.div`
  display: flex;
  margin: 1rem 0 0;
  align-items: center;
  justify-content: space-between;

  .form-group {
    flex: 1;
    margin-left: 5rem;
  }
`;
