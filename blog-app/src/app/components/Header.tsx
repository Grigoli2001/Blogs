"use client";
import Link from "next/link";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  padding: 10px;
  background-color: #1976d2;
  border-bottom: 1px solid #eaeaea;
  /* width: 100%; */
  z-index: 100;
  margin-bottom: 20px;
  display: flex;
`;

const Nav = styled.nav`
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// const LoginButton = styled.button`
//   background-color: transparent;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 5px;
// `;

const Text = styled.h1`
  color: white;
`;

export const Header = () => (
  <HeaderWrapper>
    <Link href="/">
      <Nav>
        <Text>Blogs</Text>
      </Nav>
    </Link>
  </HeaderWrapper>
);
