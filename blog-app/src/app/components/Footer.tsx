"use client";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 20px;
  background-color: #1976d2;
  border-top: 1px solid #eaeaea;
  text-align: center;
  position: static;
  bottom: 0;
`;

export const Footer = () => (
  <FooterWrapper>
    <p>© 2024 My Blog</p>
  </FooterWrapper>
);
