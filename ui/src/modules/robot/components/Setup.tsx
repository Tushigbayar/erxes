import CollapseContent from 'modules/common/components/CollapseContent';
import { __ } from 'modules/common/utils';
import { ROLE_SETUP, ROLE_SETUP_DETAILS } from 'modules/robot/constants';
import { IFeature, IRoleValue } from 'modules/robot/types';
import React from 'react';
import styled from 'styled-components';
import {
  Container,
  Greeting,
  NavButton,
  SetupList,
  SubContent
} from './styles';
import colors from 'modules/common/styles/colors';
import dimensions from 'modules/common/styles/dimensions';
import { getCurrentUserName } from 'modules/robot/utils';
import { IUser } from 'modules/auth/types';
import Icon from 'modules/common/components/Icon';
import SetupDetail from '../containers/SetupDetail';

const Text = styled.div`
  font-weight: normal;
  background: ${colors.colorWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  &:hover {
    cursor: pointer;
  }

  h6 {
    margin: 0px;
    width: 80%;
  }

  p {
    margin: 0px;
    font-size: 11px;
    background-color: rgba(101, 105, 223, 0.8);
    color: white;
    padding: 2px 5px 2px;
    border-radius: ${dimensions.unitSpacing}px;
  }
`;

type Props = {
  currentRoute?: string;
  changeRoute: (route: string) => void;
  roleValue: IRoleValue;
  currentUser: IUser;
  showContent: boolean;
  toggleContent: (isShow: boolean) => void;
};

type State = { selectedOption: IFeature; showComplete: boolean };

class Setup extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { selectedOption: {} as IFeature, showComplete: true };
  }

  onRoleClick = (title?: string) => {
    this.setState(
      { selectedOption: title ? ROLE_SETUP_DETAILS[title] : {} },
      () => {
        this.props.changeRoute('setupDetail');
      }
    );
  };

  withHeader = (content: React.ReactNode) => {
    const { changeRoute, currentRoute, toggleContent } = this.props;

    const onBack = () => {
      changeRoute('setupList');
    };

    const onHide = () => {
      toggleContent(false);
    };

    return (
      <>
        {currentRoute === 'setupDetail' && (
          <NavButton onClick={onBack}>
            <Icon icon="arrow-left" size={24} />
          </NavButton>
        )}

        <NavButton id="robot-feature-close" onClick={onHide} right={true}>
          <Icon icon="times" size={17} />
        </NavButton>
        {content}
      </>
    );
  };

  renderSetup() {
    const { roleValue } = this.props;

    return (
      <SetupList>
        {ROLE_SETUP.map(group => (
          <CollapseContent
            key={group.key}
            id={group.key}
            title={__(group.title)}
          >
            {group.content.map((content, index) => {
              if (content.types.includes(roleValue.value)) {
                return (
                  <Text
                    key={index}
                    onClick={this.onRoleClick.bind(this, content.title)}
                  >
                    <h6>{content.name}</h6>
                    <p>{content.steps}</p>
                  </Text>
                );
              }
              return null;
            })}
          </CollapseContent>
        ))}
      </SetupList>
    );
  }

  renderContent() {
    const { selectedOption } = this.state;
    const { currentRoute, currentUser, roleValue } = this.props;
    const text = "Let's set up your workplace for success";

    if (currentRoute === 'setupDetail') {
      return this.withHeader(
        selectedOption && <SetupDetail roleOption={selectedOption} />
      );
    }

    if (currentRoute === 'setupList') {
      return this.withHeader(
        <>
          <Greeting>
            <b>
              {__('Hello')}! {getCurrentUserName(currentUser)}
              <span role="img" aria-label="Wave">
                👋
              </span>
            </b>
            <p>{__(text)}.</p>
          </Greeting>

          <SubContent>
            <h4>
              {roleValue.label} {__('Setup')}
            </h4>
          </SubContent>

          {this.renderSetup()}
        </>
      );
    }
    return null;
  }

  render() {
    return <Container>{this.renderContent()}</Container>;
  }
}

export default Setup;
