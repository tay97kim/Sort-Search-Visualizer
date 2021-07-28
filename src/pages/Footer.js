import React from "react";
import styled from 'styled-components';

export default function Main() {
    return (
        <Footer>
            <FooterContent>
                <Name>Sort Visualizer</Name>
            </FooterContent>
            <FooterContent>
                <InnerContent>
                    Designed by Prof. Jongwan Kim, produced by TaeSeong Kim
                    <p />[2021.07] - 모두를 위한 컴퓨팅 사고
                </InnerContent>
            </FooterContent>
            <FooterContent>
                <img src="header_logo.jpg" width="295" height="56" />
                <img src="ccl.png" width="200" height="56" />
            </FooterContent>
        </Footer >
    )
}

const Footer = styled.footer`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 300px;
    align-content: space-between;
    background-color: #71B309;
    justify-content: center;
`

const FooterContent = styled.div`
    display: flex;
    background-color: #71B309;
    width: 100%;
    align-content: center;
    justify-content: space-evenly;
    padding-top:10px;
`

const Name = styled.div`
    font-size: 40px;
    color: white;
`

const InnerContent = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    font-Size:19px;
    line-height: 100% !important;
`
