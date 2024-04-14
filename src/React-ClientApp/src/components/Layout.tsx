import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

interface LayoutProps {
  children?: React.ReactNode; // 'children' prop is optional
}

export class Layout extends Component<LayoutProps> {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Container tag="main">
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
