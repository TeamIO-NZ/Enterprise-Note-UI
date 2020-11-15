import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderWithRouter from '../setupTests';
import Login from './Login'

afterEach(cleanup);

test("Login page should load", async () => {
    renderWithRouter(<Login />);

    const loginInst = await screen.findAllByText("Login");

    expect(loginInst[0]).toBeInTheDocument();
});